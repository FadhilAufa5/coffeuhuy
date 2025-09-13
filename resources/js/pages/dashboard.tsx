import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Coffee, Calendar, MapPin, DollarSign, AlertTriangle, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Chart from 'react-apexcharts';
import { useState } from 'react';

export default function Dashboard() {
  const { stats } = usePage().props as { stats: any };
  const [open, setOpen] = useState(false);

  const chartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    colors: ['#4f46e5'],
    dataLabels: { enabled: false },
  };

  const chartSeries = [{ name: 'Revenue', data: stats.revenuePerDay ?? [0, 0, 0, 0, 0, 0, 0] }];

  // Gabungkan notifikasi
  const notifications = [
    ...(stats.lowStockProducts?.map((p: string) => ({
      type: 'warning',
      message: `Low stock: ${p}`,
    })) || []),
    ...(stats.upcomingEvents?.map((e: any) => ({
      type: 'info',
      message: `Upcoming event: ${e.title} (${e.date})`,
    })) || []),
  ];

  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
      <Head title="Dashboard" />

      <div className="p-8 max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center relative">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Overview of your CoffeeShop performance</p>
          </div>

          {/* Notification Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition relative"
            >
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 block w-3 h-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-200">
                  Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition`}
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
                    <li className="p-3 text-sm text-gray-500 dark:text-gray-400">No notifications</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Coffee, label: 'Products', value: stats.totalProducts, color: 'bg-indigo-500' },
            { icon: Calendar, label: 'Events', value: stats.totalEvents, color: 'bg-pink-500' },
            { icon: MapPin, label: 'Outlets', value: stats.totalOutlets, color: 'bg-emerald-500' },
            {
              icon: DollarSign,
              label: 'Revenue',
              value: `Rp ${Number(stats.totalRevenue).toLocaleString()}`,
              color: 'bg-amber-500',
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card
                key={idx}
                className="flex flex-col items-start p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <div className={`${card.color} p-3 rounded-xl text-white mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <Card className="p-6 col-span-2 shadow-lg bg-white dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Revenue Overview</h2>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
          </Card>

          {/* Upcoming Events */}
          <Card className="p-6 shadow-lg bg-white dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upcoming Events</h2>
            <ul className="space-y-3">
              {stats.upcomingEvents.length > 0 ? (
                stats.upcomingEvents.map((event: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">{event.title}</span>
                   <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(event.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming events</p>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
