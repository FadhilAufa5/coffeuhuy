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
    'bank',
    'buyer_name',
    'confirmed',
];
  
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeFilter($query, $filters)
{
    return $query
        ->when($filters['search'] ?? null, fn($q, $search) =>
            $q->where('invoice_number', 'like', "%{$search}%"))
        ->when($filters['from'] ?? null, fn($q, $from) =>
            $q->whereDate('created_at', '>=', $from))
        ->when($filters['to'] ?? null, fn($q, $to) =>
            $q->whereDate('created_at', '<=', $to))
        ->when($filters['status'] ?? null, fn($q, $status) =>
            $status !== 'all' ? $q->where('status', $status) : null)
        ->when($filters['payment_method'] ?? null, fn($q, $method) =>
            $method !== 'all' ? $q->where('payment_method', $method) : null);
}

}
