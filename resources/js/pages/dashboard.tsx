import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Coffee, Calendar, MapPin, DollarSign, AlertTriangle, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Chart from 'react-apexcharts';
import { useState } from 'react';
import { motion } from 'framer-motion';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { stats } = usePage().props as { stats: any };
  const [open, setOpen] = useState(false);

  // Opsi untuk chart Revenue Overview
  const chartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    colors: ['#4f46e5'],
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#e5e7eb', // Warna grid lebih lembut
    },
    tooltip: {
      theme: 'light',
    },
  };

  const chartSeries = [{ name: 'Revenue', data: stats.revenuePerDay ?? [0, 0, 0, 0, 0, 0, 0] }];

  // Menggabungkan notifikasi stok rendah dan acara mendatang
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

  // Data untuk kartu statistik dengan gaya yang diperbarui
  const statCards = [
    {
      icon: Coffee,
      label: 'Total Produk',
      value: stats.totalProducts,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: Calendar,
      label: 'Total Acara',
      value: stats.totalEvents,
      iconBg: 'bg-pink-100 dark:bg-pink-900/50',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
    {
      icon: MapPin,
      label: 'Total Outlet',
      value: stats.totalOutlets,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: DollarSign,
      label: 'Pendapatan',
      value: `Rp ${Number(stats.totalRevenue).toLocaleString()}`,
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
      <Head title="Dashboard" />

      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Selamat Datang Kembali!</h1>
            <p className="text-gray-500 dark:text-gray-400">Berikut adalah ringkasan performa CoffeeShop Anda.</p>
          </div>

          {/* Tombol Notifikasi */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition relative"
            >
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 block w-3 h-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
              )}
            </button>

            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-200">
                  Notifikasi
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        ) : (
                          <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">{n.message}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">Tidak ada notifikasi baru</li>
                  )}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Kartu Statistik Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
            >
              <Card className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${card.iconBg}`}>
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>


        {/* Ringkasan Pendapatan & Acara Mendatang */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Pendapatan */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 shadow-sm bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Ringkasan Pendapatan</h2>
              <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
            </Card>
          </motion.div>

          {/* Acara Mendatang */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 shadow-sm bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 h-full">
              <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-500" />
                Acara Mendatang
              </h2>
              <ul className="space-y-4">
                {stats.upcomingEvents.length > 0 ? (
                  stats.upcomingEvents.map((event: any, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{event.title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <span className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        {new Date(event.date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                        })}
                      </span>
                    </li>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada acara mendatang 🎉</p>
                  </div>
                )}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}