import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Coffee, Calendar, DollarSign, AlertTriangle, Bell, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { OrdersTable } from '@/components/OrdersTable'; // pastikan path sesuai

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
      <div className="p-6 space-y-8">
        {/* HEADER & Notifikasi */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ringkasan performa dan aktivitas toko Anda hari ini
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="relative p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-[10px] text-white font-semibold">
                    {notifications.length}
                  </span>
                </span>
              )}
            </button>

            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifikasi</h3>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className={`p-1.5 rounded-md ${n.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                          {n.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{n.message}</span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      Tidak ada notifikasi baru
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* GRID STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {card.label}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {card.value}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-lg ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* TABEL PESANAN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <OrdersTable orders={orders} handleConfirm={handleConfirm} itemsPerPage={5} />
        </motion.div>
      </div>
    </AppLayout>
  );
}
