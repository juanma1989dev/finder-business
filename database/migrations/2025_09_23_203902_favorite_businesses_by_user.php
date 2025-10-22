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
        Schema::create('favorite_business_by_user', function(Blueprint $table){
            $table->integer('id_user');
            $table->uuid('id_business');
            $table->boolean('is_favorite')->default(false);

            $table->primary(['id_user', 'id_business']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('favorite_business_by_user');
    }
};
