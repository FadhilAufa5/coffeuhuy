<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class KasirController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('name')->get();

        return Inertia::render('Kasir/Index', [
            'products' => $products
        ]);
    }

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
                'total' => $request->total,
                'status' => 'pending',
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'price'      => $product->price,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'Gagal memproses pesanan.');
        }

        // ✅ redirect ke detail order
        return Redirect::route('kasir.show', $order->id)
            ->with('success', 'Pesanan berhasil dibuat!');
    }

    public function show(Order $kasir) // <- param name "kasir" sesuai route resource
    {
        $kasir->load('items.product');

        return Inertia::render('Kasir/Show', [
            'order' => $kasir
        ]);
    }

    public function pay(Request $request, Order $order)
    {
        $request->validate([
            'payment_method' => 'required|string|in:Cash,QRIS,Bank Transfer',
        ]);

        $order->update([
            'payment_method' => $request->payment_method,
            'status' => 'paid',
        ]);

        return Redirect::route('kasir.show', $order->id)
            ->with('success', 'Pembayaran berhasil!');
    }
}
