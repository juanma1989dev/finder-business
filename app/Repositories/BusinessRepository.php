<?php

namespace App\Repositories;

use App\Models\Businesses;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use MatanYadaev\EloquentSpatial\Objects\Point;

class BusinessRepository extends BaseRepository
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

    public function syncPayments($id, array $payments = []) : Businesses
    {
        $business = $this->findById($id);
        $business->payments()->sync($payments);

        return $business;
    }

    public function updateSchedules(int $id, array $schedules = []): Businesses
    {
        $business = $this->findById($id);

        DB::transaction(function () use ($business, $schedules) {
            $business->hours()->delete();

            $hoursData = collect($schedules)->map(function ($dayData) use ($business) {
                return [
                    'id_business' => $business->id,
                    'day' => $dayData['day'],
                    'is_open' => $dayData['isOpen'],
                    'open' => $dayData['isOpen'] ? $dayData['open'] : null,
                    'close' => $dayData['isOpen'] ? $dayData['close'] : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            if (!empty($hoursData)) {
                $business->hours()->insert($hoursData);
            }
        });

        return $business->fresh(['hours']);
    }

    public function updateNetworks($id, $data): void
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


    public function search(array $filters): Collection
    {
        $query = $this->model->with(['category:id,name,image']);

        if (!empty($filters['q'])) {
            $q = $filters['q'];
            $query->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('long_description', 'like', "%{$q}%")
                    ->orWhere('tags', 'like', "%{$q}%");
            });
        }

        if (!empty($filters['category'])) {
            $query->where('id_category', $filters['category']);
        }
        
        $dist = $filters['dist'] ?? null;
        if ($dist && $dist->lat && $dist->long && $dist->radius) {
            $point = new Point($dist->lat, $dist->long);
            $radiusInMeters = $dist->radius * 1000;

            $query->whereDistanceSphere('cords', $point, '<=', $radiusInMeters);

            $query->selectRaw('*, ROUND( ST_Distance_Sphere(cords, POINT(?, ?)) /1000, 1 ) as distance', [
                $dist->long,  
                $dist->lat
            ]);

            $query->orderBy('distance', 'asc');
        }

        return $query->get();
    }

    public function getFavoritesByUser(int $userId): Collection
    {
        return $this->model
            ->whereHas('favorites', function ($query) use ($userId) {
                $query->where('id_user', $userId)
                      ->where('is_favorite', true);
            })
            ->with(['category:id,name,image'])
            ->get();
    }
}

