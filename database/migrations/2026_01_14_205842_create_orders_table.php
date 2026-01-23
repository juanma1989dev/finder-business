<?php

use App\Enums\OrderStatusEnum;
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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

           


            $table->string('status')->default(OrderStatusEnum::PENDING->value);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->text('notes')->nullable();

             $table->foreignId('delivery_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->timestamp('ready_for_pickup_at')->nullable();
            $table->timestamp('picked_up_at')->nullable();
            $table->timestamp('on_the_way_at')->nullable();
            
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
