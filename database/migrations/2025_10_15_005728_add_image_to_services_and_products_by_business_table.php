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
        Schema::table('services_and_products_by_business', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('isActive');  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services_and_products_by_business', function (Blueprint $table) {
            $table->dropColumn('image_url');
        });
    }
};
