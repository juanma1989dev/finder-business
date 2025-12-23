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
        Schema::create('business_payment', function(Blueprint $table){
            $table->foreignId('business_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('payment_id')
                ->constrained('payments')
                ->cascadeOnDelete();

            $table->primary(['business_id', 'payment_id']);
        });    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('business_payment');
    }
};
