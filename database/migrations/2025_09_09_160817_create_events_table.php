<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');              // nama event
            $table->text('description');         // deskripsi event
            $table->date('date');                // tanggal event
            $table->string('image')->nullable(); // foto event (opsional)
            $table->boolean('is_new')->default(true); // status event baru
            $table->timestamps();                // created_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
