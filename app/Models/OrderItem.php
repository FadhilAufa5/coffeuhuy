<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    /**
     * Atribut yang boleh diisi secara massal.
     */
   protected $fillable = [
    'order_id',
    'product_id',
    'quantity',
    'price',
    'product_name',
    'product_image',
];


    /**
     * Relasi Many-to-One ke Order.
     * Satu OrderItem dimiliki oleh satu Order.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
