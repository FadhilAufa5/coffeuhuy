<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Event;
use App\Models\Outlet;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'totalProducts' => Product::count(),
                'totalEvents'   => Event::count(),
                'totalOutlets'  => Outlet::count(),
                // Revenue bisa dihitung dari tabel orders kalau ada
                'totalRevenue'  => 0, 

                // produk yang hampir habis stok (jika ada field stock)
                'lowStockProducts' => Product::where('stock', '<', 5)->pluck('name'),

                // ambil event mendatang
                'upcomingEvents' => Event::whereDate('date', '>=', now())
                    ->orderBy('date', 'asc')
                    ->take(5)
                    ->get(['name as title', 'date', 'is_new']),
            ],
        ]);
    }
}
