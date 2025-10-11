import React, { useMemo } from "react";
import { Head } from "@inertiajs/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { formatRupiah } from "@/lib/utils";

interface ProductSummary {
  id: number;
  name: string;
  total_sold: number;
  total_revenue: number;
}

interface DashboardData {
  total_sales: number;          // Total uang penjualan
  total_items_sold: number;     // Total produk terjual (jumlah semua item)
  total_transactions: number;   // Jumlah transaksi
  top_products: ProductSummary[];
  sales_by_day: { date: string; total: number }[]; // Data untuk grafik
}

export default function AdminKasir({ data }: { data: DashboardData }) {
  // 💡 Statistik ringkasan cepat
  const stats = useMemo(
    () => [
      { title: "Total Penjualan", value: formatRupiah(data.total_sales) },
      { title: "Total Produk Terjual", value: data.total_items_sold },
      { title: "Total Transaksi", value: data.total_transactions },
    ],
    [data]
  );

  return (
    <>
      <Head title="Dashboard Kasir" />
      <div className="p-6 min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">📊 Dashboard Admin Kasir</h1>

        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-5 border border-gray-200 flex flex-col justify-center"
            >
              <h2 className="text-gray-500 text-sm">{s.title}</h2>
              <p className="text-2xl font-bold text-red-700 mt-2">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Grafik Penjualan Harian */}
        <div className="bg-white rounded-xl shadow p-5 mb-8 border border-gray-200">
          <h2 className="font-semibold mb-4 text-gray-700">Tren Penjualan Harian</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.sales_by_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatRupiah(value)} />
              <Bar dataKey="total" fill="#991B1B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Produk Terlaris */}
        <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
          <h2 className="font-semibold mb-4 text-gray-700">Produk Terlaris</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border text-left">Produk</th>
                  <th className="p-3 border text-right">Jumlah Terjual</th>
                  <th className="p-3 border text-right">Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {data.top_products.length > 0 ? (
                  data.top_products.map((prod, i) => (
                    <tr key={prod.id} className="hover:bg-gray-50">
                      <td className="p-3 border text-center">{i + 1}</td>
                      <td className="p-3 border">{prod.name}</td>
                      <td className="p-3 border text-right">{prod.total_sold}</td>
                      <td className="p-3 border text-right">{formatRupiah(prod.total_revenue)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      Belum ada data penjualan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
