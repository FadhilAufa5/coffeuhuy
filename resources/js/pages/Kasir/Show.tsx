import React, { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Receipt, CreditCard, Banknote, QrCode, Building2 } from "lucide-react";
import axios from "axios";
import InvoicePrint from "./InvoicePrint";
import { Card } from "@/components/ui/card";

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

  const banks = ["BCA", "Mandiri", "BRI", "BNI", "CIMB Niaga", "BSI"];

  const paymentMethods = [
    { value: "Cash", label: "Cash", icon: Banknote },
    { value: "QRIS", label: "QRIS", icon: QrCode },
    { value: "Debit", label: "Debit Card", icon: CreditCard },
  ];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 relative overflow-hidden">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="mb-6"
            >
              <CheckCircle2 className="w-24 h-24 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Pembayaran Berhasil!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400 mt-2"
            >
              Menampilkan invoice...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-6 print:p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-colors border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Invoice</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {order.invoice_number || `ORD-${order.id}`}
              </h1>
            </div>
            <Receipt className="w-8 h-8 text-gray-400" />
          </div>

          <span
            className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${
              currentStatus === "paid"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
            }`}
          >
            {currentStatus === "paid" ? "Lunas" : "Belum Dibayar"}
          </span>
        </div>

        {/* Order Items */}
        <Card className="p-6">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>Daftar Barang</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">({order.items.length} items)</span>
          </h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={item.id}
                className={`flex justify-between items-center py-3 ${
                  idx !== order.items.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity} × {formatRupiah(item.product.price)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-red-700 dark:text-red-400">
                  {formatRupiah(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Section */}
        <Card className="p-6">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Ringkasan Pembayaran
          </h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-medium">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>PPN (11%)</span>
              <span className="font-medium">{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-800">
              <span>Total</span>
              <span className="text-red-700 dark:text-red-400">{formatRupiah(animatedTotal)}</span>
            </div>
          </div>

          {/* Payment Method */}
          {currentStatus === "pending" && (
            <div className="space-y-5 mt-6">
              <div>
                <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === method.value
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <method.icon 
                        className={`w-6 h-6 mb-2 ${
                          paymentMethod === method.value 
                            ? "text-red-600 dark:text-red-400" 
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <span className={`text-sm font-medium ${
                        paymentMethod === method.value
                          ? "text-red-700 dark:text-red-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}>
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Inputs */}
              {paymentMethod === "Cash" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Harga Total (Rp)
                    </label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Masukkan harga total"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Uang Diberikan (Rp)
                    </label>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Masukkan jumlah uang"
                    />
                  </div>
                  {cashGiven && customPrice && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg font-semibold text-lg ${
                        change < 0 
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" 
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      }`}
                    >
                      {change < 0
                        ? `Kurang ${formatRupiah(Math.abs(change))}`
                        : `Kembalian: ${formatRupiah(change)}`}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Bank Selection for Debit */}
              {paymentMethod === "Debit" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>Pilih Bank</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {banks.map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`py-2.5 px-4 rounded-lg border-2 transition-all text-sm font-medium ${
                          selectedBank === bank
                            ? "bg-red-800 hover:bg-red-700 text-white border-red-900"
                            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                  {selectedBank && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Bank dipilih: <span className="font-semibold text-gray-900 dark:text-white">{selectedBank}</span>
                    </motion.p>
                  )}
                </motion.div>
              )}

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-red-800 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white py-3.5 rounded-xl font-semibold disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Bayar Sekarang ({paymentMethod})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {currentStatus === "paid" && (
            <button
              onClick={() => (window.location.href = "/kasir")}
              className="mt-6 w-full bg-green-700 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Kembali ke Beranda</span>
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}
