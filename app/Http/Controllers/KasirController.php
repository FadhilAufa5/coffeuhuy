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
     * ✅ Simpan pesanan baru (belum dibayar).
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

          // 🔹 Generate nomor invoice
        $today = now()->format('Ymd');
        $lastOrder = Order::whereDate('created_at', now()->toDateString())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastOrder
            ? intval(substr($lastOrder->invoice_number, -4)) + 1
            : 1;

      

        // 🔹 Buat order baru
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
     * ✅ Proses pembayaran (ubah ke paid).
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

    /**
     * ✅ Setelah pesanan selesai diproses (kitchen/serving done).
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
