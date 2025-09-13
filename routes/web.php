<?php
use App\Http\Controllers\ProductController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OutletController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;




Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
  
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Events
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');

    // Outlet
    
    Route::get('outlets', [OutletController::class, 'index'])->name('outlets.index');
    Route::post('outlets', [OutletController::class, 'store'])->name('outlets.store');
    Route::delete('outlets/{outlet}', [OutletController::class, 'destroy'])->name('outlets.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
