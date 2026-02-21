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
        Schema::create('business', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('category_id')
                ->constrained('business_categories')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('slug')->unique();
            $table->string('slogan')->nullable();
            $table->mediumText('description')->nullable();            
            $table->string('phone');
            $table->boolean('use_whatsapp')->default(false);
            $table->string('cover_image', 250)->nullable();
            $table->string('tags', 250)->nullable();
            $table->boolean('is_open')->default(false);
            $table->boolean('status')->default(true);
            
            $table->string('location', 60);
            $table->string('address', 250);
            $table->geometry('cords', 'point')->nullable();

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business');
    }
};
