<?php

use App\Enums\DayOfWeek;
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
        Schema::create('business_hours', function (Blueprint $table) {
            $table->id();

            $table->foreignId('businesses_id')
                ->constrained('businesses')
                ->cascadeOnDelete();

            $table->enum('day', DayOfWeek::allValues());
            $table->time('open')->nullable();
            $table->time('close')->nullable();
            $table->boolean('is_open')->default(false);
            $table->timestamps();
            $table->unique(['businesses_id', 'day']);
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
