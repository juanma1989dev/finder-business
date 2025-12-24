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
        Schema::create('businesses_payments', function(Blueprint $table){
            $table->foreignId('businesses_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('payments_id')
                ->constrained('payments')
                ->cascadeOnDelete();

            $table->primary(['businesses_id', 'payments_id']);
        });    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('businesses_payments');
    }
};
