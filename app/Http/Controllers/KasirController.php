<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class KasirController extends Controller
{
    /**
     * ✅ Tampilkan halaman kasir dengan daftar produk.
     */
    public function index()
    {
        $products = Product::orderBy('name')->get();

        return Inertia::render('Kasir/Index', [
            'products' => $products,
        ]);
    }

   public function adminkasir(Request $request)
{
    $period = $request->input('period', 'day'); // default: harian

    $from = $request->input('from')
        ? \Carbon\Carbon::parse($request->input('from'))->startOfDay()
        : now()->subDays(7)->startOfDay();

    $to = $request->input('to')
        ? \Carbon\Carbon::parse($request->input('to'))->endOfDay()
        : now()->endOfDay();

    if ($from->greaterThan($to)) {
        return Redirect::back()->with('error', 'Rentang tanggal tidak valid.');
    }

    $orderQuery = Order::whereIn('status', ['paid', 'accepted'])
        ->whereBetween('created_at', [$from, $to]);

    $total_sales = $orderQuery->sum('total');
    $total_items_sold = DB::table('order_items')
        ->join('orders', 'order_items.order_id', '=', 'orders.id')
        ->whereIn('orders.status', ['paid', 'accepted'])
        ->whereBetween('orders.created_at', [$from, $to])
        ->sum('order_items.quantity');
    $total_transactions = $orderQuery->count();

    // 🔹 Produk terjual (untuk diagram pie)
    $product_sales = DB::table('order_items')
        ->join('orders', 'order_items.order_id', '=', 'orders.id')
        ->join('products', 'order_items.product_id', '=', 'products.id')
        ->whereIn('orders.status', ['paid', 'accepted'])
        ->whereBetween('orders.created_at', [$from, $to])
        ->select(
            'products.name as product',
            DB::raw('SUM(order_items.quantity) as total_sold'),
            DB::raw('SUM(order_items.price * order_items.quantity) as revenue')
        )
        ->groupBy('products.name')
        ->orderByDesc('revenue')
        ->get();

    // 🔹 Pendapatan berdasarkan periode
    $dateSelect = match ($period) {
        'month' => DB::raw("DATE_FORMAT(created_at, '%Y-%m') as date"),
        'year'  => DB::raw("DATE_FORMAT(created_at, '%Y') as date"),
        default => DB::raw("DATE(created_at) as date"),
    };

    $sales_chart = DB::table('orders')
        ->whereIn('status', ['paid', 'accepted'])
        ->whereBetween('created_at', [$from, $to])
        ->select($dateSelect, DB::raw('SUM(total) as total'))
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get();

    $data = [
        'total_sales' => $total_sales,
        'total_items_sold' => $total_items_sold,
        'total_transactions' => $total_transactions,
        'product_sales' => $product_sales,
        'sales_chart' => $sales_chart,
    ];

    return inertia('Kasir/AdminKasir', [
        'data' => $data,
        'filters' => [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'period' => $period,
        ],
    ]);
}


    /**
     * ✅ Simpan pesanan baru.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator);
        }

        try {
            DB::beginTransaction();

            $order = Order::create([
                'invoice_number' => 'INV-' . now()->format('Ymd') . '-' . str_pad(Order::count() + 1, 4, '0', STR_PAD_LEFT),
                'total' => $request->total,
                'status' => 'pending',
                'payment_method' => null,
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'product_name' => $product->name,
                    'product_image' => $product->image,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'Gagal memproses pesanan.');
        }

        return Redirect::route('kasir.show', $order->id)
            ->with('success', 'Pesanan berhasil dibuat! Silakan lakukan pembayaran.');
    }

    /**
     * ✅ Tampilkan detail pesanan.
     */
    public function show(Order $kasir)
    {
        $kasir->load('items.product');

        return Inertia::render('Kasir/Show', [
            'order' => $kasir,
        ]);
    }

    /**
     * ✅ Proses pembayaran.
     */
    public function pay(Request $request, Order $order)
    {
        $request->validate([
            'payment_method' => 'required|string|in:Cash,QRIS,Debit',
        ]);

        $order->update([
            'payment_method' => $request->payment_method,
            'status' => 'paid',
        ]);

        return Redirect::route('kasir.show', $order->id)
            ->with('success', 'Pembayaran berhasil!');
    }

    /**
     * ✅ Terima pesanan setelah dibayar.
     */
    public function accept(Request $request, Order $order)
    {
        if ($order->status !== 'paid') {
            return Redirect::back()->with('error', 'Pesanan belum dibayar, tidak bisa di-accept.');
        }

        $order->update([
            'status' => 'accepted',
            'confirmed' => true,
        ]);

        return Redirect::back()->with('success', 'Pesanan telah diterima!');
    }
}
