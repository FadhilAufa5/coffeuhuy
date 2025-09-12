<?php

namespace App\Http\Controllers;

use App\Models\Outlet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;


class OutletController extends Controller
{
    /**
     * Tampilkan daftar outlet
     */
    public function index()
    {
        $outlets = Outlet::latest()->get();

        return Inertia::render('Outlets/Index', [
            'outlets' => $outlets,
        ]);
    }

   
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'required|string',
            'city'    => 'required|string',
            'phone'   => 'required|string|max:20',
            'image'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('outlets', 'public');
        }

        Outlet::create($validated);

        return redirect()->route('outlets.index')->with('success', 'Outlet berhasil ditambahkan!');
    }

    /**
     * Hapus outlet
     */
    public function destroy(Outlet $outlet)
    {
        if ($outlet->image) {
            Storage::disk('public')->delete($outlet->image);
        }

        $outlet->delete();

        return redirect()->route('outlets.index')->with('success', 'Outlet berhasil dihapus!');
    }
}
