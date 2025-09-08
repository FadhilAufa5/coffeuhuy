<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Menampilkan daftar produk
    public function index()
    {
        $products = Product::latest()->get();
        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    // Menambahkan produk baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($validated);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan!');
    }

    // Menghapus produk
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus!');
    }
}
