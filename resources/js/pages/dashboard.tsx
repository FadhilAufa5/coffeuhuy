import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { Coffee, ShoppingCart, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard().url }];

// Mock data
const mockStats = {
  totalProducts: 24,
  totalOrders: 120,
  totalRevenue: 3200000,
  totalDelivered: 98,
  lowStockProducts: ['Latte', 'Espresso'],
};

export default function Dashboard() {
  const [stats] = useState(mockStats);

  const chartOptions = {
    chart: { type: 'area', height: 350, stacked: true, toolbar: { show: false }, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
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
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Overview of your CoffeeShop performance</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-4 flex items-center gap-4 shadow-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <Coffee className="w-8 h-8 text-[#1b1b18] dark:text-[#EDEDEC]" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Products</p>
              <p className="text-xl font-bold">{stats.totalProducts}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 shadow-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <ShoppingCart className="w-8 h-8 text-[#1b1b18] dark:text-[#EDEDEC]" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Orders</p>
              <p className="text-xl font-bold">{stats.totalOrders}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 shadow-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <DollarSign className="w-8 h-8 text-[#1b1b18] dark:text-[#EDEDEC]" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue</p>
              <p className="text-xl font-bold">Rp {stats.totalRevenue.toLocaleString()}</p>
            </div>
          </Card>


        </div>

        {/* Low Stock Notifications */}
        {stats.lowStockProducts.length > 0 && (
          <Card className="p-4 flex items-center gap-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 shadow-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-700 dark:text-yellow-200">
              Products low in stock: {stats.lowStockProducts.join(', ')}
            </p>
          </Card>
        )}

        {/* Revenue Chart */}
        <Card className="p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Revenue Overview</h2>
          <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
        </Card>
      </div>
    </AppLayout>
  );
}
