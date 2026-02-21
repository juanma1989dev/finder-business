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
            $table->foreignId('product_id')
                ->constrained('business_products')
                ->cascadeOnDelete();

            $table->string('name');       
            $table->timestamps();
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
