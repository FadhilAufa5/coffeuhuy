import React, { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { router } from "@inertiajs/react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: string;
  buyer_name: string;
}

export default function OrderShow({ order }: { order: Order }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  // Animate total when page loads or payment method changes
  useEffect(() => {
    let start = 0;
    const duration = 500;
    const step = (total - start) / (duration / 10);
    const interval = setInterval(() => {
      start += step;
      if (start >= total) {
        start = total;
        clearInterval(interval);
      }
      setAnimatedTotal(Math.round(start));
    }, 10);
    return () => clearInterval(interval);
  }, [total]);

  const handlePayment = () => {
    setIsProcessing(true);
    router.post(
      `/kasir/${order.id}/pay`,
      { payment_method: paymentMethod },
      {
        onFinish: () => setIsProcessing(false),
        onSuccess: () => {
          alert("✅ Pembayaran berhasil!");
          router.visit(`/kasir/${order.id}`);
        },
        onError: () => {
          alert("❌ Gagal memproses pembayaran");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Order Details */}
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Order #{order.id}
            </h1>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                order.status === "paid"
                  ? "bg-green-100 text-green-700 animate-pulse"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status === "paid" ? "Lunas" : "Belum Dibayar"}
            </span>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-600">Nama Pembeli</p>
            <h2 className="text-lg font-semibold">{order.buyer_name}</h2>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white/70 p-4 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-md"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {formatRupiah(item.product.price)}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-red-700">
                  {formatRupiah(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Payment & Summary */}
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ringkasan Pembayaran
            </h2>

            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN (11%)</span>
                <span>{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold text-2xl text-red-800 transition-all duration-500">
                <span>Total</span>
                <span>{formatRupiah(animatedTotal)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Pilih Metode Pembayaran
              </h3>
              <div className="flex flex-wrap gap-3 relative">
                {["Cash", "QRIS", "Bank Transfer"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-5 py-2 rounded-full font-medium border transition relative z-10 ${
                      paymentMethod === method
                        ? "bg-red-800 text-white border-red-900 shadow-lg scale-105"
                        : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="mt-6 w-full bg-red-800 text-white py-4 rounded-2xl shadow-xl hover:bg-red-700 disabled:bg-gray-400 transition font-semibold text-lg transform hover:scale-105 duration-300"
          >
            {isProcessing
              ? "Memproses..."
              : `Bayar Sekarang (${paymentMethod})`}
          </button>
        </div>
      </div>
    </div>
  );
}
