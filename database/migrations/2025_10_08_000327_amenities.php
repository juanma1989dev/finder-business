<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('amenities', function(Blueprint $table){
            $table->id();
            $table->string('name', 200);
            $table->string('icon', 30)->nullable(); 
            $table->boolean('status');
        });

        $categories = [
            [ 'name'   => 'WiFi gratis', 'status' => 1, 'icon' => 'Wifi'  ],
            [ 'name'   => 'Estacionamiento propio', 'status' => 1, 'icon' => 'CircleParking'  ],  
            [ 'name'   => 'Estacionamiento en la calle', 'status' => 1, 'icon' => 'ParkingMeter'],  
            [ 'name'   => 'Pet Friendly', 'status' => 1, 'icon' => 'PawPrint'  ],
            [ 'name'   => 'Asientos al aire libre', 'status' => 1, 'icon' => 'RockingChair'  ],
            [ 'name'   => 'Se puede reservar', 'status' => 1, 'icon' => 'NotebookPen'  ],
            [ 'name'   => 'Baños', 'status' => 1, 'icon' => 'Toilet'  ],
            [ 'name'   => 'Área para niños', 'status' => 1, 'icon' => 'Baby' ],
        ];

        foreach($categories as $category){
            DB::table('amenities')->insert($category);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('amenities');
    }
};
