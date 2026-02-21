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
        Schema::create('product_categories', function(Blueprint $table){
            $table->id();
            $table->string('name')->unique();
            $table->string('icon')->nullable();  
            $table->boolean('status')->default(1);
            $table->timestamps();
        });

        $categories = [
            ['name' => 'Hamburguesas', 'icon' => '🍔', 'status' => 1],
            ['name' => 'Pizza',        'icon' => '🍕', 'status' => 1],
            ['name' => 'Tacos',        'icon' => '🌮', 'status' => 1],
            ['name' => 'Postres',      'icon' => '🍰', 'status' => 1],
            ['name' => 'Bebidas',      'icon' => '🥤', 'status' => 1],
            ['name' => 'Frutas',       'icon' => '🍎', 'status' => 1],
            ['name' => 'Otros',        'icon' => '🍴', 'status' => 1],
        ];

        foreach($categories as $category){
            $category['created_at'] = now();
            $category['updated_at'] = now();
            DB::table('product_categories')->insert($category);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_categories');
    }
};