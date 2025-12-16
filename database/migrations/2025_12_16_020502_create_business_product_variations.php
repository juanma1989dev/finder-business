<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('business_product_variations', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');  
            $table->string('name');       
            $table->timestamps();

            $table->foreign('product_id')
                  ->references('id')
                  ->on('services_and_products_by_business')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_product_variations');
    }
};
