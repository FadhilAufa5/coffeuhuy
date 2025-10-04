<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    /**
     * Atribut yang boleh diisi secara massal (mass assignable).
     */
   protected $fillable = [
    'total',
    'status',
    'payment_method',
];
    /**
     * Relasi One-to-Many ke OrderItem.
     * Satu Order memiliki banyak OrderItem.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
