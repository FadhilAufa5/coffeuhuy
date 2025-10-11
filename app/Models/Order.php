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
    'invoice_number',
    'total',
    'status',
    'payment_method',
    'confirmed',
];
  
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
