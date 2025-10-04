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
     * Menampilkan halaman utama kasir.
     * Logika utama: Mengambil semua produk dari database dan mengirimkannya
     * sebagai 'props' ke komponen React 'Kasir/Index'.
     */
    public function index()
    {
        // Mengambil semua produk, diurutkan berdasarkan nama
        $products = Product::orderBy('name')->get();

        // Mengirim data produk ke frontend saat halaman dimuat
        return Inertia::render('Kasir/Index', [
            'products' => $products
        ]);
    }

    
    public function store(Request $request)
    {
        // 1. Validasi data yang dikirim dari React
        $validator = Validator::make($request->all(), [
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|integer|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            // Jika validasi gagal, kembalikan ke halaman kasir dengan pesan error
            return Redirect::back()->withErrors($validator);
        }

        // 2. Gunakan DB Transaction untuk memastikan integritas data
        try {
            DB::beginTransaction();

            // Buat record pesanan (order) baru
            $order = Order::create([
                'total' => $request->total,
                'status' => 'completed',
            ]);

            // Simpan setiap item di keranjang sebagai order_items
            foreach ($request->cart as $item) {
                $product = Product::find($item['id']);
                // Buat relasi item ke order yang baru dibuat
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price, // Ambil harga dari DB, bukan dari request, untuk keamanan
                ]);
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            // Jika terjadi error, kembalikan dengan pesan error
            return Redirect::back()->with('error', 'Gagal memproses pesanan. Silakan coba lagi.');
        }

        // 3. Jika berhasil, kembalikan ke halaman kasir dengan pesan sukses
        return Redirect::route('kasir.index')->with('success', 'Pesanan berhasil dibuat!');
    }
}