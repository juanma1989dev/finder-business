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
        Schema::create('business', function(Blueprint $table){
            $table->uuid('id')->primary()->default(DB::raw('(UUID())'));
            $table->string('name');
            $table->string('description');
            $table->mediumText('long_description');
            $table->string('location', 60);
            $table->string('address', 250);
            $table->string('phone');
            $table->uuid('id_category');
            $table->uuid('user_id');
            $table->boolean('use_whatsapp');
            $table->string('cover_image', 250)->nullable();            
            $table->string('tags', 250)->nullable();      
            
            
            $table->geometry('cords', subtype: 'point')->nullable();
        }); 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('business');
    }
};
