<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Event;
use App\Models\Outlet;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        
        $totalRevenue = Order::whereIn('status', ['paid', 'accepted'])->sum('total');

        return Inertia::render('dashboard', [ 
            'stats' => [
                'totalProducts' => Product::count(),
                'totalEvents'   => Event::count(),
                'totalOutlets'  => Outlet::count(),

              
                'totalRevenue'  => $totalRevenue,

               
                'upcomingEvents' => Event::whereDate('date', '>=', now())
                    ->orderBy('date', 'asc')
                    ->take(5)
                    ->get(['name as title', 'date']),
            ],

            
            'orders' => Order::orderBy('id', 'asc')
                ->get(['id', 'total', 'status', 'payment_method']),
        ]);
    }
}
