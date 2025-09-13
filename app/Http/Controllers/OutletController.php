<?php

namespace App\Http\Controllers;

use App\Models\Outlet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OutletController extends Controller
{
    public function index()
    {
        $outlets = Outlet::latest()->get();

        return Inertia::render('Outlets/Index', [
            'outlets' => $outlets,
            'flash' => [
                'success' => session('success')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'address'    => 'required|string|max:255',
            'city'       => 'required|string|max:255',
            'phone'      => 'required|string|max:20',
            'image'      => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'open_time'  => 'nullable|date_format:H:i',  // validasi jam buka
            'close_time' => 'nullable|date_format:H:i',  // validasi jam tutup
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('outlets', 'public');
        }

        Outlet::create($data);

        return redirect()->back()->with('success', 'Outlet berhasil ditambahkan!');
    }

    public function destroy(Outlet $outlet)
    {
        if ($outlet->image) {
            Storage::disk('public')->delete($outlet->image);
        }

        $outlet->delete();

        return redirect()->back()->with('success', 'Outlet berhasil dihapus!');
    }
}
