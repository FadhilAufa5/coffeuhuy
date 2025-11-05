import { Head, router } from "@inertiajs/react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { formatRupiah } from "@/lib/utils";
import { TrendingUp, ShoppingBag, CreditCard, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NavbarKasir from "@/components/NavbarKasir";
import { OrdersTable } from "@/components/OrdersTable";
import { useState } from "react";

interface DashboardData {
    total_sales: number;
    total_items_sold: number;
    total_transactions: number;
    product_sales: { product: string; total_sold: number; revenue: number }[];
    sales_chart: { date: string; total: number }[];
}

interface Order {
    id: number;
    total: number;
    payment_method: string;
    buyer_name: string;
    status: string;
}

interface Props {
    data: DashboardData;
    orders: Order[];
    filters: { from: string; to: string; period: string };
}

const COLORS = ["#991B1B", "#DC2626", "#EF4444", "#F87171", "#FCA5A5", "#FECACA"];


export default function AdminKasir({ data, orders: initialOrders, filters }: Props) {
    const [from, setFrom] = useState(filters.from || "");
    const [to, setTo] = useState(filters.to || "");
    const [period, setPeriod] = useState(filters.period || "day");
    const [orders, setOrders] = useState(initialOrders);

    const stats = [
        {
            title: "Total Penjualan",
            value: formatRupiah(data.total_sales),
            icon: CreditCard,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/20",
        },
        {
            title: "Produk Terjual",
            value: data.total_items_sold,
            icon: ShoppingBag,
            color: "text-red-700 dark:text-red-500",
            bg: "bg-red-100 dark:bg-red-900/30",
        },
        {
            title: "Total Transaksi",
            value: data.total_transactions,
            icon: TrendingUp,
            color: "text-red-800 dark:text-red-600",
            bg: "bg-red-200 dark:bg-red-900/40",
        },
    ];

    const applyFilter = () => {
        const params: any = { period };
        if (from) params.from = from;
        if (to) params.to = to;
        
        router.get("/admin/kasir", params, { 
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        setFrom("");
        setTo("");
        setPeriod("day");
        router.get("/admin/kasir", { period: "day" }, { 
            preserveState: true,
            preserveScroll: true,
        });
    };

    // 🔔 Toast notification
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.className = `
            fixed bottom-6 right-6 px-5 py-3 rounded-lg text-white text-sm font-semibold shadow-xl z-50 
            transition-all duration-500 transform
            ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

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
        <>
            <Head title="Dashboard Kasir" />
            <NavbarKasir />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Kasir</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Analisis penjualan berdasarkan periode waktu
                    </p>
                </div>

                {/* Filter Section */}
                <Card className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h2 className="font-semibold text-gray-900 dark:text-white">Filter Data</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                                Dari Tanggal
                            </label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                value={from} 
                                onChange={(e) => setFrom(e.target.value)} 
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                                Sampai Tanggal
                            </label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                value={to} 
                                onChange={(e) => setTo(e.target.value)} 
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                                Periode
                            </label>
                            <select 
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                value={period} 
                                onChange={(e) => setPeriod(e.target.value)}
                            >
                                <option value="day">Harian</option>
                                <option value="month">Bulanan</option>
                                <option value="year">Tahunan</option>
                            </select>
                        </div>
                        
                        <div className="flex gap-2 items-end">
                            <Button 
                                onClick={applyFilter} 
                                className="flex-1 bg-red-800 hover:bg-red-900 text-white"
                            >
                                Terapkan
                            </Button>
                            <Button 
                                onClick={resetFilter} 
                                variant="outline"
                                className="px-3"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Grafik Pendapatan
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data.sales_chart}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#991B1B" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#991B1B" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#9CA3AF" 
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis 
                                    stroke="#9CA3AF" 
                                    fontSize={12}
                                    tickLine={false}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        padding: '8px 12px'
                                    }}
                                    formatter={(value: number) => [formatRupiah(value), 'Pendapatan']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#991B1B" 
                                    strokeWidth={2}
                                    fill="url(#colorTotal)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card className="p-6">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Produk Paling Laris
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.product_sales}
                                    dataKey="revenue"
                                    nameKey="product"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    label={(entry) => entry.product.length > 15 ? `${entry.product.substring(0, 12)}...` : entry.product}
                                >
                                    {data.product_sales.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        padding: '8px 12px'
                                    }}
                                    formatter={(value: number) => [formatRupiah(value), 'Revenue']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* TABEL KONFIRMASI PESANAN */}
                <OrdersTable orders={orders} handleConfirm={handleConfirm} itemsPerPage={10} />
            </div>
        </>
    );
}