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
     * ✅ Tampilkan halaman kasir dengan daftar produk.
     */
    public function index()
    {
        $products = Product::orderBy('name')->get();

        return Inertia::render('Kasir/Index', [
            'products' => $products,
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
        'payment_method' => 'required|string|in:Cash,QRIS,Transfer',
    ]);

    if ($validator->fails()) {
        return Redirect::back()->withErrors($validator);
    }

    try {
        DB::beginTransaction();

        // Langsung paid kalau metode pembayaran sudah dipilih
        $order = Order::create([
            'total' => $request->total,
            'status' => 'paid',
            'payment_method' => $request->payment_method,
        ]);

        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);

            $order->items()->create([
                'product_id'    => $product->id,
                'quantity'      => $item['quantity'],
                'price'         => $product->price,
                'product_name'  => $product->name,
                'product_image' => $product->image,
            ]);
        }

        DB::commit();

    } catch (\Exception $e) {
        DB::rollBack();
        return Redirect::back()->with('error', 'Gagal memproses pesanan.');
    }

    return Redirect::route('kasir.show', $order->id)
        ->with('success', 'Pesanan berhasil dibuat & dibayar!');
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
     * ✅ Update status menjadi "paid" jika pembayaran dilakukan setelah order.
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

    
    public function accept(Request $request, Order $order)
    {
      
        if ($order->status !== 'paid') {
            return Redirect::back()->with('error', 'Pesanan belum dibayar, tidak bisa di-accept.');
        }

        $order->update([
            'status' => 'accepted',
            'confirmed' => true, // jika kolom ini ada
        ]);

        return Redirect::back()->with('success', 'Pesanan telah diterima!');
    }
}
