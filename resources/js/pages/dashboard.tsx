import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Coffee, Calendar, DollarSign, AlertTriangle, Bell, CheckCircle, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface DashboardPageProps extends Record<string, any> {
  stats: {
    totalProducts: number;
    totalEvents: number;
    totalRevenue: number;
    lowStockProducts?: string[];
    upcomingEvents?: { title: string; date: string }[];
  };
  orders: {
    id: number;
    total: number;
    payment_method: string | null;
    status: string;
    confirmed?: boolean;
  }[];
}

// 🔔 Fungsi Toast JS murni
function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className = `
    fixed bottom-6 right-6 px-5 py-3 rounded-lg text-white text-sm font-semibold shadow-xl z-50 
    transition-all duration-500 transform
    ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export default function Dashboard() {
  const { stats, orders: initialOrders } = usePage<DashboardPageProps>().props;
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState(initialOrders);

  // 🔔 Data notifikasi stok & event
  const notifications = [
    ...(stats.lowStockProducts?.map((p: string) => ({
      type: 'warning',
      message: `Stok menipis: ${p}`,
    })) || []),
    ...(stats.upcomingEvents?.map((e: any) => ({
      type: 'info',
      message: `Acara mendatang: ${e.title} (${e.date})`,
    })) || []),
  ];

  // 📊 Statistik utama
  const statCards = [
    {
      icon: Coffee,
      label: 'Total Produk',
      value: stats.totalProducts,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    },
    {
      icon: Calendar,
      label: 'Total Acara',
      value: stats.totalEvents,
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-100 dark:bg-pink-900/40',
    },
    {
      icon: DollarSign,
      label: 'Pendapatan',
      value: `Rp ${Number(stats.totalRevenue).toLocaleString()}`,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/40',
    },
  ];

  // ✅ Fungsi konfirmasi
  const handleConfirm = (orderId: number) => {
    router.post(`/kasir/${orderId}/accept`, {}, {
      onSuccess: () => {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showToast('✅ Pesanan telah dikonfirmasi!', 'success');
      },
      onError: () => {
        showToast('❌ Gagal mengonfirmasi pesanan.', 'error');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
      <Head title="Dashboard" />
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Ringkasan performa dan aktivitas toko Anda hari ini.
            </p>
          </div>

          {/* 🔔 Notifikasi */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="p-3 rounded-full bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 block w-3 h-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
              )}
            </button>

            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="p-3 border-b text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Notifikasi
                </div>
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                        ) : (
                          <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">{n.message}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      Tidak ada notifikasi baru
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* GRID STATISTIK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{card.label}</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{card.value}</h3>
                  </div>
                  <div className={`p-4 rounded-xl ${card.bg}`}>
                    <card.icon className={`w-7 h-7 ${card.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* TABEL PESANAN */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-green-600" /> Konfirmasi Pembayaran
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Metode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Konfirmasi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                      >
                        <td className="py-3 px-4">{idx + 1}</td>
                        <td className="py-3 px-4">Rp {Number(order.total).toLocaleString()}</td>
                        <td className="py-3 px-4">{order.payment_method || '-'}</td>
                        <td className="py-3 px-4 capitalize">{order.status}</td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            disabled={order.status !== 'paid'}
                            onChange={() => handleConfirm(order.id)}
                            className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-400"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-5 text-center text-gray-500 dark:text-gray-400 text-sm"
                      >
                        Tidak ada pesanan untuk dikonfirmasi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
