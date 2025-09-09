<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    // Nama tabel (opsional, Laravel otomatis pakai 'events')
    protected $table = 'events';

    // Field yang bisa diisi (mass assignment)
    protected $fillable = [
        'name',
        'description',
        'date',
        'image',
        'is_new',
    ];

    // Casting tipe data
    protected $casts = [
        'date' => 'date',       // otomatis jadi instance Carbon
        'is_new' => 'boolean',  // true/false
    ];
}
