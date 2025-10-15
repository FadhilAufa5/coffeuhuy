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
import { motion } from "framer-motion";
import { formatRupiah } from "@/lib/utils";
import { TrendingUp, ShoppingBag, CreditCard, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Ditambahkan untuk kelengkapan
import NavbarKasir from "@/components/NavbarKasir";
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

// Komponen Tooltip kustom untuk tampilan yang lebih baik
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-md border border-gray-200 dark:border-gray-800">
                <p className="label text-sm text-gray-700 dark:text-gray-300">{`${label}`}</p>
                <p className="intro font-semibold text-red-800 dark:text-red-500">{`Pendapatan : ${formatRupiah(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

// Fungsi untuk memotong label PieChart agar tidak tumpang tindih
const renderCustomizedLabel = ({ name, cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const truncatedName = name.length > 12 ? `${name.substring(0, 10)}...` : name;

    return (
        <text x={x} y={y} fill="#6b7280" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
            {truncatedName}
        </text>
    );
};


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
                color: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/50 dark:border-emerald-800",
            },
            {
                title: "Produk Terjual",
                value: data.total_items_sold,
                icon: <ShoppingBag className="w-6 h-6 text-indigo-600" />,
                color: "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/50 dark:border-indigo-800",
            },
            {
                title: "Total Transaksi",
                value: data.total_transactions,
                icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
                color: "bg-amber-50 border-amber-200 dark:bg-amber-900/50 dark:border-amber-800",
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
            <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
                {/* Bagian Header & Filter */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                        <div className="space-y-1 mb-4 md:mb-0">
                           
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Dashboard Kasir
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                Analisis penjualan berdasarkan periode waktu
                            </p>
                        </div>
                    </div>

                   
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                       <div className="flex flex-col">
                            <Label htmlFor="from" className="text-sm text-gray-600 dark:text-gray-300 mb-1">Dari Tanggal</Label>
                            <input id="from" type="date" className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700" value={from} onChange={(e) => setFrom(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="to" className="text-sm text-gray-600 dark:text-gray-300 mb-1">Sampai Tanggal</Label>
                            <input id="to" type="date" className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700" value={to} onChange={(e) => setTo(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="period" className="text-sm text-gray-600 dark:text-gray-300 mb-1">Periode</Label>
                            <select id="period" className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700" value={period} onChange={(e) => setPeriod(e.target.value)}>
                                <option value="day">Harian</option>
                                <option value="month">Bulanan</option>
                                <option value="year">Tahunan</option>
                            </select>
                        </div>
                        <Button onClick={applyFilter} className="w-full bg-red-800 hover:bg-red-900 text-white font-medium">
                            <Filter className="w-4 h-4 mr-2" />
                            Terapkan
                        </Button>
                    </div>
                </div>

               
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
                                <p className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-1">
                                    {s.value}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

             
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    
                    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 shadow-md border rounded-2xl border-gray-200 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
                            Grafik Pendapatan ({period})
                        </h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={data.sales_chart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#991B1B" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#991B1B" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `Rp${new Intl.NumberFormat('id-ID').format(value / 1000)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="total" stroke="#991B1B" strokeWidth={3} fillOpacity={1} fill="url(#colorPendapatan)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Produk Terjual (Pie Chart) */}
                    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 shadow-md border rounded-2xl border-gray-200 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
                            Produk Paling Laris
                        </h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={data.product_sales}
                                    dataKey="revenue"
                                    nameKey="product"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    labelLine={false}
                                    label={renderCustomizedLabel} 
                                >
                                    {data.product_sales.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatRupiah(value)} labelFormatter={(label) => `Produk: ${label}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}