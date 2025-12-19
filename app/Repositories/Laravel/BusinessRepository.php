<?php

namespace App\Repositories\Laravel;

use App\DTOs\SchedulesDTO;
use App\Models\Businesses;
use App\Models\BusinessProductExtra;
use App\Models\BusinessProductVariation;
use App\Repositories\Contracts\BusinessRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use MatanYadaev\EloquentSpatial\Objects\Point;

class BusinessRepository extends BaseRepository implements BusinessRepositoryInterface
{
    public function __construct(Businesses $model)
    {
        $this->model = $model;
    }

    public function syncServices($id, array $services = []): Businesses
    {
        $business = $this->findById($id);
        $business->services()->sync($services);
        
        return $business;
    }

    public function syncPayments(string $id, array $payments = []): Businesses
    {
        $business = $this->findById($id);
        $business->payments()->sync($payments);

        return $business;
    }

    public function updateSchedules(string $id, SchedulesDTO $schedules): Businesses
    {
        $business = $this->findById($id);

        DB::transaction(function () use ($business, $schedules) {
            $business->hours()->delete();

            $hoursData = [];
            
            foreach($schedules->data ?? [] as $schedule){
                $newSchedule = $schedule->toArray();
                $newSchedule['business_id'] = $business->id;
                $hoursData[] = $newSchedule;
            }

            if (!empty($hoursData)) {
                $business->hours()->insert($hoursData);
            }
        });

        return $business->fresh(['hours']);
    }

    public function updateNetworks(string $id, array $data): void
    {
        $business = $this->findById($id);

        $business->socialNetworks()->updateOrCreate(
            ['id_business' => $business->id],
            $data
        );
    }

    public function createProductOrService($idBusiness, array $data)
    {
        $business = $this->findById($idBusiness);
        return $business->productsAndServices()->create($data);
    }

    /**
     * Buscar negocios con filtros y geolocalización mejorada
     *
     * @param array $filters ['q' => string, 'category' => string|int, 'dist' => object{lat, long, radius}]
     * @return Collection
     */
    public function search(array $filters): Collection
    {
        $query = $this->model->query()
            ->with([
                'category:id,name,image',
                'productsAndServices' => fn($q) => $q->where('isActive', true)->select('id', 'business_id', 'name', 'price', 'image_url')
            ]);

        # Búsqueda por texto (nombre, descripción, tags)
        if (!empty($filters['q'])) {
            $searchTerm = $filters['q'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('short_description', 'like', "%{$searchTerm}%")
                  ->orWhere('long_description', 'like', "%{$searchTerm}%")
                  ->orWhere('tags', 'like', "%{$searchTerm}%");
            });
        }

        # Filtro por tipo de comida  
        if (!empty($filters['foodType'])) { 
            
            $foodType = $filters['foodType'] ?? null;

            $query->whereHas('productsAndServices', function ($q) use ( $foodType ) {
                $q->where('product_category_id', $foodType);
            });
        }

        # Filtro por categoría 
        if (!empty($filters['category'])) {
            $query->where('id_category', $filters['category']);
        }
        
        # Geolocalización con distancia (usando Spatial)
        $dist = $filters['dist'] ?? null;
        
        if ($dist && isset($dist->lat) && isset($dist->long)) {
            $point = new Point($dist->lat, $dist->long);
            
            # Si hay radio, filtrar por distancia
            if (isset($dist->radius) && $dist->radius > 0) {
                $radiusInMeters = $dist->radius * 1000; # Convertir KM a metros
                $query->whereDistanceSphere('cords', $point, '<=', $radiusInMeters);
            }

            # Obtener el nombre real de la tabla desde el modelo
            $tableName = $this->model->getTable();

            # Calcular distancia en KM y agregar al resultado
            $query->selectRaw(
                "{$tableName}.*, ROUND(ST_Distance_Sphere(cords, POINT(?, ?)) / 1000, 1) as distance",
                [$dist->long, $dist->lat]
            );

            # Ordenar por distancia (más cercanos primero)
            $query->orderBy('distance', 'asc');
        } else {
            $query->orderBy('name', 'asc');
        }

        return $query->get();
    }

    /**
     * Obtener negocios favoritos de un usuario
     */
    public function getFavoritesByUser(int $userId): Collection
    {
        return $this->model
            ->whereHas('favorites', function ($query) use ($userId) {
                $query->where('id_user', $userId)
                      ->where('is_favorite', true);
            })
            ->with(['category:id,name,image'])
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Crear variación de producto
     */
    public function createProductVariation(string $productId, array $variation)
    {
        return BusinessProductVariation::create([
            'product_id' => $productId,
            'name' => $variation['name'],
        ]);
    }

    /**
     * Crear extra de producto
     */
    public function createProductExtra(string $productId, array $extra)
    {
        return BusinessProductExtra::create([
            'product_id' => $productId,
            'name' => $extra['name'],
            'price' => $extra['price'],
        ]);
    }
}