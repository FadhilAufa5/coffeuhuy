// resources/js/Components/Cart.tsx
import React from "react";
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
  onClose?: () => void; // opsional buat drawer mobile
  isMobile?: boolean;

  // ✅ Tambahan props baru
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
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
  paymentMethod,
  setPaymentMethod,
}: CartProps) {
  return (
    <div
      className={`${
        isMobile
          ? "w-full max-w-md bg-white flex flex-col h-full"
          : "w-96 bg-white border-l flex flex-col h-screen"
      }`}
    >
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-6 py-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
            <p className="text-xs text-gray-500">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-6xl mb-3">🛒</div>
            <p className="text-gray-400">Keranjang kosong</p>
          </div>
        </div>
      ) : (
        <>
          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-red-700 text-sm font-medium">
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer - Fixed (Totals + Button) */}
          <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t">
            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pajak (11%)</span>
                <span>{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-red-700">{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || cart.length === 0}
              className="w-full bg-red-800 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
            >
              {isProcessing ? "Memproses..." : "Bayar Sekarang"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
  