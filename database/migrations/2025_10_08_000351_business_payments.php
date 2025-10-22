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
        Schema::create('business_payments', function(Blueprint $table){
            $table->id();
            $table->string('name', 200);
            $table->string('icon', 30)->nullable(); 
            $table->boolean('status');
        });

        $categories = [
            [ 'name'   => 'Efectivo', 'status' => 1 , 'icon' => 'BadgeDollarSign' ],
            [ 'name'   => 'Tarjeta de crédito', 'status' => 1, 'icon' => 'CreditCard'  ],
            [ 'name'   => 'Tarjeta de débito', 'status' => 1, 'icon' => 'CreditCard' ],
        ];

        foreach($categories as $category){
            DB::table('business_payments')->insert($category);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('business_payments');
    }
};
