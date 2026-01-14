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
         Schema::create('order_item_variations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_item_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('variation_id')
                ->constrained('business_product_variations')
                ->restrictOnDelete();

            $table->string('variation_name'); // snapshot
            $table->decimal('price', 10, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item_variations');
    }
};
