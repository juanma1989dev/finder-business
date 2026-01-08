<?php

use App\Enums\PlanTypeEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique();

            $table->unsignedInteger('max_businesses')->default(1);

            $table->boolean('advanced_stats')->default(false);
            $table->boolean('featured')->default(false);

            $table->decimal('price', 8, 2)->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });

        $categories = [
             [
                'name' => PlanTypeEnum::NORMAL,
                'max_businesses' => 1,
                'advanced_stats' => false,
                'featured' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => PlanTypeEnum::PREMIUM,
                'max_businesses' => 5,
                'advanced_stats' => true,
                'featured' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach($categories as $category){
            DB::table('plans')->insert($category);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
