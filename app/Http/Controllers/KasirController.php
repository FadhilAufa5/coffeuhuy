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
    /**
     * Tampilkan halaman kasir dengan daftar produk
     */
    public function index()
    {
        $products = Product::orderBy('name')->get();

        return Inertia::render('Kasir/Index', [
            'products' => $products
        ]);
    }

    /**
     * Simpan pesanan baru
     */
    public function store(Request $request)
    {
        // ✅ Validasi request
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:Cash,QRIS,Transfer', // ✅ tambahkan validasi payment method
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator);
        }

        try {
            DB::beginTransaction();

            // ✅ Buat order baru
            $order = Order::create([
                'total' => $request->total,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
            ]);

            // ✅ Tambahkan item ke order
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                $order->items()->create([
                    'product_id'    => $product->id,
                    'quantity'      => $item['quantity'],
                    'price'         => $product->price,
                    'product_name'  => $product->name,   // jika kolom ini ada
                    'product_image' => $product->image,  // jika kolom ini ada
                ]);
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'Gagal memproses pesanan.');
        }

        return Redirect::route('kasir.show', $order->id)
            ->with('success', 'Pesanan berhasil dibuat!');
    }

    /**
     * Tampilkan detail pesanan
     */
    public function show(Order $kasir) // <- $kasir karena pakai Route Model Binding dari kasir resource
    {
        $kasir->load('items.product');

        return Inertia::render('Kasir/Show', [
            'order' => $kasir
        ]);
    }

    /**
     * Bayar pesanan yang sudah dibuat (jika metode pembayaran dipilih belakangan)
     */
    public function pay(Request $request, Order $order)
    {
        $request->validate([
            'payment_method' => 'required|string|in:Cash,QRIS,Transfer',
        ]);

        $order->update([
            'payment_method' => $request->payment_method,
            'status' => 'paid',
        ]);

        return Redirect::route('kasir.show', $order->id)
            ->with('success', 'Pembayaran berhasil!');
    }
}
