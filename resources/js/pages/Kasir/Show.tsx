import React, { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import InvoicePrint from "./InvoicePrint";

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
}

interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: string;
  buyer_name: string;
  payment_method: string;
  invoice_number: string;
}

export default function OrderShow({ order }: { order: Order }) {
  const [paymentMethod, setPaymentMethod] = useState(order.payment_method || "QRIS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashGiven, setCashGiven] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [change, setChange] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [selectedBank, setSelectedBank] = useState(""); // ✅ bank yang dipilih
  const invoiceNumber = order.invoice_number || "-";

  const banks = ["BCA", "Mandiri", "BRI", "BNI", "CIMB Niaga", "BSI"]; // ✅ daftar bank

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  // 🔹 Animasi angka total
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

  // 🔹 Hitung kembalian
  useEffect(() => {
    if (paymentMethod === "Cash" && cashGiven && customPrice) {
      const price = parseFloat(customPrice) || 0;
      const given = parseFloat(cashGiven) || 0;
      setChange(given - price);
    } else {
      setChange(0);
    }
  }, [cashGiven, customPrice, paymentMethod]);

  // 🔹 Handle pembayaran
  const handlePayment = async () => {
    if (paymentMethod === "Cash" && (!cashGiven || !customPrice)) {
      alert("Masukkan harga dan uang yang diberikan!");
      return;
    }

    // ✅ Validasi bank saat debit
    if (paymentMethod === "Debit" && !selectedBank) {
      alert("Pilih bank terlebih dahulu!");
      return;
    }

    setIsProcessing(true);

    try {
      await axios.post(`/kasir/${order.id}/pay`, {
        payment_method: paymentMethod,
        bank: selectedBank, // ✅ kirim data bank jika debit
      });

      // Simulasi loading dan animasi
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        setCurrentStatus("paid");

        // Setelah animasi sukses, tampilkan invoice dan print otomatis
        setTimeout(() => {
          setShowSuccess(false);
          setShowInvoice(true);
          setTimeout(() => {
            window.print();
          }, 1000);
        }, 1800);
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Gagal memproses pembayaran!");
      setIsProcessing(false);
    }
  };

  // 🔹 Tampilan invoice setelah sukses bayar
  if (showInvoice) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center print:p-0">
        <InvoicePrint
          order={order}
          paymentMethod={paymentMethod}
          cashGiven={parseFloat(cashGiven) || 0}
          change={change}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative overflow-hidden">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="text-green-600 text-6xl mb-4"
            >
              ✅
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800">
              Pembayaran Berhasil!
            </h1>
            <p className="text-gray-600 mt-2">Menampilkan invoice...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-6 print:p-4">
        {/* Header */}
        <div className="flex justify-between items-center print:hidden">
          <button
            onClick={() => window.history.back()}
            className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            ← Kembali
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            {order.invoice_number || `ORD-${order.id}`}
          </h1>

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              currentStatus === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {currentStatus === "paid" ? "Lunas" : "Belum Dibayar"}
          </span>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg border-b pb-2">Daftar Barang</h2>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2 last:border-none"
            >
              <div>
                <p className="font-medium text-gray-800">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {formatRupiah(item.product.price)}
                </p>
              </div>
              <span className="font-semibold text-red-700">
                {formatRupiah(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">
            Ringkasan Pembayaran
          </h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>PPN (11%)</span>
            <span>{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>{formatRupiah(animatedTotal)}</span>
          </div>

          {/* Payment Method */}
          {currentStatus === "pending" && (
            <>
              <div className="mt-4">
                <label className="block font-semibold mb-2">
                  Metode Pembayaran
                </label>
                <div className="flex gap-3">
                  {["Cash", "QRIS", "Debit"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-4 py-2 rounded-md border transition ${
                        paymentMethod === method
                          ? "bg-red-700 text-white border-red-800"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Inputs */}
              {paymentMethod === "Cash" && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Harga Total (Rp)
                    </label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="Masukkan harga total"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Uang Diberikan (Rp)
                    </label>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="Masukkan jumlah uang"
                    />
                  </div>
                  {cashGiven && customPrice && (
                    <p
                      className={`font-semibold ${
                        change < 0 ? "text-red-600" : "text-green-700"
                      }`}
                    >
                      {change < 0
                        ? `Kurang ${formatRupiah(Math.abs(change))}`
                        : `Kembalian: ${formatRupiah(change)}`}
                    </p>
                  )}
                </div>
              )}

              {/* ✅ Tambahan: Pilihan Bank untuk Debit */}
              {paymentMethod === "Debit" && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pilih Bank
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {banks.map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`py-2 px-3 rounded-md border transition text-sm font-medium ${
                          selectedBank === bank
                            ? "bg-red-800 hover:bg-red-700 text-white border-red-900"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                  {selectedBank && (
                    <p className="mt-2 text-sm text-gray-600">
                      Bank dipilih: <span className="font-semibold">{selectedBank}</span>
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="mt-6 w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-md font-semibold disabled:bg-gray-400"
              >
                {isProcessing
                  ? "Memproses..."
                  : `Bayar Sekarang (${paymentMethod})`}
              </button>
            </>
          )}

          {currentStatus === "paid" && (
            <button
              onClick={() => (window.location.href = "/kasir")}
              className="mt-6 w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-md font-semibold"
            >
              Kembali ke Beranda
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
