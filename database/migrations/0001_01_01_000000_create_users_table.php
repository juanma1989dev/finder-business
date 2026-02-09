<?php

use App\Enums\UserTypeEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum(
                'type',
                array_column(UserTypeEnum::cases(), 'value')
            )->nullable();

            $table->string('google_id')->nullable()->unique();
            $table->timestamp('email_verified_at')->nullable();

            $table->boolean('privacy_accepted')->default(false);
            $table->string('privacy_version')->nullable();
            $table->timestamp('privacy_accepted_at')->nullable();

            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes(); 
        });

        Schema::create('delivery_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete()
                ->unique();

            // $table->string('vehicle_type')->nullable(); // moto, bici, auto
            $table->boolean('is_active')->default(true);  

            $table->timestamps();
        });

        Schema::create('delivery_statuses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('delivery_profile_id')
                ->constrained()
                ->cascadeOnDelete()
                ->unique();

            $table->boolean('is_available')->default(false);
            $table->timestamp('last_available_at')->nullable();

            $table->timestamps();
        });



        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('delivery_statuses');
        Schema::dropIfExists('delivery_profiles');
        Schema::dropIfExists('users');
    }
};
