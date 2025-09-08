<?php
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
  
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('events/index', [\App\Http\Controllers\EventController::class, 'index'])->name('events.index');
    Route::get('locations/index', [\App\Http\Controllers\LocationsController::class, 'index'])->name('locations.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
