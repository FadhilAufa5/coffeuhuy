import React from "react";
import { X, Trash2, CreditCard, User } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  updateQuantity: (id: number, amount: number) => void;
  handlePayment: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  buyerName: string;
  setBuyerName: (name: string) => void;
}

export default function Cart({
  cart,
  subtotal,
  tax,
  total,
  isProcessing,
  updateQuantity,
  handlePayment,
  onClose,
  isMobile = false,
  buyerName,
  setBuyerName,
}: CartProps) {
  return (
    <div
      className={`${
        isMobile
          ? "w-full max-w-md bg-white dark:bg-gray-900 flex flex-col h-full shadow-2xl"
          : "w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col h-screen"
      }`}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-red-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-5xl">🛒</div>
            </div>
            <p className="text-gray-400 dark:text-gray-500 font-medium">Keranjang kosong</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Tambahkan produk untuk memulai</p>
          </div>
        </div>
      ) : (
        <>
          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors group"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                      {item.quantity}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-red-700 dark:text-red-400 text-sm font-bold mt-1">
                      {formatRupiah(item.price)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Total: {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 rounded-lg p-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-600" /> : <span>−</span>}
                      </button>
                      <span className="w-6 text-center font-semibold text-sm text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Name Input */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4" />
              <span>Nama Pembeli</span>
            </label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Masukkan nama pembeli"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Footer - Totals & Payment Button */}
          <div className="flex-shrink-0 px-5 py-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Pajak (11%)</span>
                <span className="font-medium">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-800">
                <span>Total</span>
                <span className="text-red-700 dark:text-red-400">{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || cart.length === 0 || !buyerName.trim()}
              className="w-full bg-red-800 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Proses Pesanan</span>
                </>
              )}
            </button>
            {!buyerName.trim() && cart.length > 0 && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Masukkan nama pembeli untuk melanjutkan
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
  