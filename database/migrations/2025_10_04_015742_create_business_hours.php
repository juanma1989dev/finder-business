<?php

use App\Domains\Shared\Enums\DayOfWeek as EnumsDayOfWeek;
use App\Enums\DayOfWeek;
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
        Schema::create('business_hours', function (Blueprint $table) {
            $table->id();

            $table->foreignId('business_id')
                ->constrained('business')
                ->cascadeOnDelete();

            $table->enum('day', EnumsDayOfWeek::allValues());
            $table->time('open')->nullable();
            $table->time('close')->nullable();
            $table->boolean('is_open')->default(false);
            $table->timestamps();
            $table->unique(['business_id', 'day']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_hours');
    }
};
