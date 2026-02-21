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
        Schema::create('business_social_networks', function(Blueprint $table){
            $table->id();
            $table->foreignId('business_id')
                    ->constrained('businesses')
                    ->cascadeOnDelete()
                    ->unique();
            $table->string('web')->nullable(); 
            $table->string('instagram')->nullable(); 
            $table->string('youtube')->nullable();
            $table->string('facebook')->nullable();
            $table->string('tiktok')->nullable();
            $table->string('twitter')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('business_social_networks');
    }
};
