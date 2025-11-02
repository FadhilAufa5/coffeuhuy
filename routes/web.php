<?php

use App\Models\Product;
use App\Models\Event;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OutletController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KasirController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================
// Public Route
// ========================
Route::get('/', function () {
    return Inertia::render('welcome', [
        'products' => Product::latest()->get(), 
        'events' => Event::latest()->get(),
        'outlets' => \App\Models\Outlet::latest()->get(),
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

   Route::resource('kasir', KasirController::class)
    ->only(['index', 'store', 'show']);

    Route::get('/adminkasir', [KasirController::class, 'adminkasir'])->name('kasir.adminkasir');
    Route::get('/historykasir', [KasirController::class, 'historykasir'])->name('kasir.historykasir');


    Route::post('/kasir/{order}/pay', [KasirController::class, 'pay'])->name('kasir.pay');
    Route::post('/kasir/{order}/accept', [KasirController::class, 'accept'])->name('kasir.accept');
});

// Extra routes
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
