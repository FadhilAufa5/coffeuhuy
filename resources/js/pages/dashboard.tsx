import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { Coffee, Calendar, MapPin, DollarSign, AlertTriangle, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard().url }];

const mockStats = {
  totalProducts: 24,
  totalEvents: 5,
  totalOutlets: 3,
  totalOrders: 120,
  totalRevenue: 3200000,
  lowStockProducts: ['Latte', 'Espresso'],
  upcomingEvents: [
    { title: 'Grand Opening Promo', date: '10 September 2025' },
    { title: 'Live Music Night', date: '15 September 2025' },
  ],
};

function EventNotification({ upcomingEvents }: { upcomingEvents: { title: string; date: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        {upcomingEvents.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {upcomingEvents.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 z-50">
          <h3 className="px-4 py-2 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
            Upcoming Events
          </h3>
          <ul className="max-h-72 overflow-y-auto p-2 space-y-2">
            {upcomingEvents.map((event, idx) => (
              <li
                key={idx}
                className="flex flex-col p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{event.title}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{event.date}</span>
                </div>
                <span className="mt-1 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full w-max">
                  New
                </span>
              </li>
            ))}
            {upcomingEvents.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400 text-center p-3">No upcoming events</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats] = useState(mockStats);

  const chartOptions = {
    chart: { type: 'area', height: 350, stacked: true, toolbar: { show: false }, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yaxis: { labels: { formatter: (val: number) => `Rp ${val.toLocaleString()}` } },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.1, stops: [0, 90, 100] } },
    colors: ['#1b1b18'],
    tooltip: { y: { formatter: (val: number) => `Rp ${val.toLocaleString()}` } },
  };

  const chartSeries = [
    { name: 'Revenue', data: [300000, 450000, 500000, 700000, 650000, 800000, 900000] },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Overview of your CoffeeShop performance</p>
          </div>
          {/* Event Notification */}
          <EventNotification upcomingEvents={stats.upcomingEvents} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Coffee, label: 'Products', value: stats.totalProducts },
            { icon: Calendar, label: 'Events', value: stats.totalEvents },
            { icon: MapPin, label: 'Outlets', value: stats.totalOutlets },
            { icon: DollarSign, label: 'Revenue', value: `Rp ${stats.totalRevenue.toLocaleString()}` },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock */}
        {stats.lowStockProducts.length > 0 && (
          <Card className="p-4 flex items-center gap-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 shadow-md rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-700 dark:text-yellow-200 font-medium">
              Products low in stock: {stats.lowStockProducts.join(', ')}
            </p>
          </Card>
        )}

        {/* Revenue Chart */}
        <Card className="p-6 shadow-md rounded-2xl bg-white dark:bg-gray-900">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Revenue Overview</h2>
          <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
        </Card>
      </div>
    </AppLayout>
  );
}
