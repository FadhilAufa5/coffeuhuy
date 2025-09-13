<?php

use App\Models\Product;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OutletController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================
// Public Route
// ========================
Route::get('/', function () {
    return Inertia::render('welcome', [
        'products' => Product::latest()->get(), // kirim produk ke halaman Welcome
    ]);
})->name('home');

// ========================
// Authenticated Routes
// ========================
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::resource('products', ProductController::class)
        ->only(['index', 'store', 'destroy']);

    // Events
    Route::resource('events', EventController::class)
        ->only(['index', 'store', 'destroy']);

    // Outlets
    Route::resource('outlets', OutletController::class)
        ->only(['index', 'store', 'destroy']);
});

// Extra routes
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
