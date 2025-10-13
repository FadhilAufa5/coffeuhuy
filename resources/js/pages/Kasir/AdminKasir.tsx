
import { Head, router } from "@inertiajs/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { formatRupiah } from "@/lib/utils";
import { TrendingUp, ShoppingBag, CreditCard, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import  NavbarKasir  from "@/components/NavbarKasir";
import { useMemo, useState } from "react";

interface DashboardData {
  total_sales: number;
  total_items_sold: number;
  total_transactions: number;
  product_sales: { product: string; total_sold: number; revenue: number }[];
  sales_chart: { date: string; total: number }[];
}

interface Props {
  data: DashboardData;
  filters: { from: string; to: string; period: string };
}

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA", "#F472B6"];

export default function AdminKasir({ data, filters }: Props) {
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);
  const [period, setPeriod] = useState(filters.period);

  const stats = useMemo(
    () => [
      {
        title: "Total Penjualan",
        value: formatRupiah(data.total_sales),
        icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
        color: "bg-emerald-50 border-emerald-200",
      },
      {
        title: "Produk Terjual",
        value: data.total_items_sold,
        icon: <ShoppingBag className="w-6 h-6 text-indigo-600" />,  
        color: "bg-indigo-50 border-indigo-200",
      },
      {
        title: "Total Transaksi",
        value: data.total_transactions,
        icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
        color: "bg-amber-50 border-amber-200",
      },
    ],
    [data]
  );

  const applyFilter = () => {
    router.get("/admin/kasir", { from, to, period }, { preserveState: true });
  };

  return (
    
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <NavbarKasir /> 
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* 🔹 Header Section */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Kasir
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Analisis penjualan berdasarkan periode waktu
          </p>
        </div>
        </div>

        {/* 🔹 Filter Section (lebih rapi dan responsif) */}
        <Card className="p-6 shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="text-emerald-600" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
              Filter Data
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <Label
                htmlFor="from"
                className="text-sm text-gray-600 dark:text-gray-300 mb-1"
              >
                Dari Tanggal
              </Label>
              <input
                id="from"
                type="date"
                className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <Label
                htmlFor="to"
                className="text-sm text-gray-600 dark:text-gray-300 mb-1"
              >
                Sampai Tanggal
              </Label>
              <input
                id="to"
                type="date"
                className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <Label
                htmlFor="period"
                className="text-sm text-gray-600 dark:text-gray-300 mb-1"
              >
                Periode
              </Label>
              <select
                id="period"
                className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="day">Harian</option>
                <option value="month">Bulanan</option>
                <option value="year">Tahunan</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={applyFilter}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                Terapkan Filter
              </Button>
            </div>
          </div>
        </Card>

        {/* 🔹 Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`p-6 rounded-2xl border shadow-sm flex items-center gap-4 ${s.color}`}
            >
              <div className="p-3 rounded-xl bg-white shadow-sm">{s.icon}</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.title}</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-1">
                  {s.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🔹 Diagram Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pendapatan (Line Chart) */}
          <Card className="p-6 bg-white dark:bg-gray-900 shadow-md border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Pendapatan ({period})
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.sales_chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(v: number) => formatRupiah(v)} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Produk Terjual (Pie Chart) */}
          <Card className="p-6 bg-white dark:bg-gray-900 shadow-md border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Produk Terjual
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={data.product_sales}
                  dataKey="revenue"
                  nameKey="product"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name }) => name}
                >
                  {data.product_sales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => formatRupiah(v)}
                  labelFormatter={(l) => `Produk: ${l}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    
  );
}
