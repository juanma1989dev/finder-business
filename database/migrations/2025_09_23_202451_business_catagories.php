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
        Schema::create('business_categories', function(Blueprint $table){
            $table->uuid('id')->primary()->default(DB::raw('(UUID())'));
            $table->string('name', 120);
            $table->boolean('status');
            $table->string('image', 60);
        });


        $categories = [
            [ 'name'   => 'Cafetería', 'image'  => 'cafeteria.jpeg',  'status' => 1  ],
            [ 'name'   => 'Comida', 'image'  => 'comida.jpeg',  'status' => 1  ],
            [ 'name'   => 'Fotografía', 'image'  => 'estudio_fotografico.png',  'status' => 1  ],
            [ 'name'   => 'Farmacia', 'image'  => 'farmacia.jpg',  'status' => 1  ],
            [ 'name'   => 'Ferretería', 'image'  => 'ferreteria.jpeg',  'status' => 1  ],
            [ 'name'   => 'Florería', 'image'  => 'floreria.png',  'status' => 1  ],
            [ 'name'   => 'Mueblería', 'image'  => 'muebleria.png',  'status' => 1  ],
        ];

        foreach($categories as $category){
            DB::table('business_categories')->insert($category);
        }

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('business_categories');
    }
};

