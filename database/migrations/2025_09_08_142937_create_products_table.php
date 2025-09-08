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
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // id primary key
            $table->string('name'); // nama produk
            $table->text('description')->nullable(); // deskripsi produk
            $table->string('type')->nullable(); // tipe/kategori produk
            $table->decimal('price', 10, 2); // harga produk
            $table->string('image')->nullable(); // path atau URL gambar produk
            $table->timestamps(); // created_at & updated_at otomatis
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
