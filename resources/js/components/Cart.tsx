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

  // ✅ Props tambahan
  paymentMethod,
  setPaymentMethod,
}: CartProps) {
  return (
    <div
      className={`${
        isMobile
          ? "w-80 bg-white p-6 flex flex-col h-full"
          : "w-96 bg-white border-l p-6 flex flex-col shadow-lg"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        )}
      </div>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          Belum ada item di keranjang
        </p>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 bg-gray-50 p-2 rounded"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">{item.name}</p>
                  <p className="text-red-600 text-sm">
                    {formatRupiah(item.price)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Selector
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metode Pembayaran
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
              <option value="QRIS">QRIS</option>
            </select>
          </div> */}

          {/* Totals */}
          <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (11%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-red-600">{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || cart.length === 0}
            className="mt-6 bg-red-800 hover:bg-red-700 text-white py-4 rounded-lg w-full font-semibold text-lg disabled:bg-gray-400"
          >
            {isProcessing ? "Processing..." : "Bayar Sekarang"}
          </button>
        </>
      )}
    </div>
  );
}
