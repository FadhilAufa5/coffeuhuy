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
import { TrendingUp, ShoppingBag, CreditCard, Filter, Calendar, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import NavbarKasir from "@/components/NavbarKasir";
import { OrdersTable } from "@/components/OrdersTable";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
            description: "Total pendapatan kotor",
            color: "text-emerald-600",
            bg: "bg-emerald-100/50 dark:bg-emerald-900/20",
        },
        {
            title: "Produk Terjual",
            value: data.total_items_sold,
            icon: ShoppingBag,
            description: "Item berhasil terjual",
            color: "text-blue-600",
            bg: "bg-blue-100/50 dark:bg-blue-900/20",
        },
        {
            title: "Total Transaksi",
            value: data.total_transactions,
            icon: TrendingUp,
            description: "Transaksi berhasil",
            color: "text-violet-600",
            bg: "bg-violet-100/50 dark:bg-violet-900/20",
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

    const handleConfirm = (orderId: number) => {
        router.post(`/kasir/${orderId}/accept`, {}, {
            onSuccess: () => {
                setOrders((prev) => prev.filter((o) => o.id !== orderId));
                toast.success("Pesanan telah dikonfirmasi!");
            },
            onError: () => {
                toast.error("Gagal mengonfirmasi pesanan.");
            },
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
            <Head title="Dashboard Kasir" />
            <NavbarKasir />
            
            <motion.div 
                className="container mx-auto p-6 space-y-8 max-w-7xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
                        <p className="text-muted-foreground mt-1">
                            Pantau performa penjualan dan transaksi toko Anda.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Refresh Data
                        </Button>
                    </div>
                </motion.div>

                {/* Filter Section */}
                <motion.div variants={itemVariants}>
                    <Card className="border-none shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg">Filter Data</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Dari Tanggal
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            type="date" 
                                            className="pl-9"
                                            value={from} 
                                            onChange={(e) => setFrom(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Sampai Tanggal
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            type="date" 
                                            className="pl-9"
                                            value={to} 
                                            onChange={(e) => setTo(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Periode
                                    </label>
                                    <Select value={period} onValueChange={setPeriod}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Periode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="day">Harian</SelectItem>
                                            <SelectItem value="month">Bulanan</SelectItem>
                                            <SelectItem value="year">Tahunan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="flex gap-2 items-end">
                                    <Button 
                                        onClick={applyFilter} 
                                        className="flex-1 bg-primary hover:bg-primary/90"
                                    >
                                        Terapkan
                                    </Button>
                                    <Button 
                                        onClick={resetFilter} 
                                        variant="outline"
                                        className="px-4"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </p>
                                        <h3 className="text-2xl font-bold tracking-tight">
                                            {stat.value}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Charts */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Grafik Pendapatan</CardTitle>
                            <CardDescription>Tren pendapatan seiring waktu</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.sales_chart}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#991B1B" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#991B1B" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#888888" 
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis 
                                            stroke="#888888" 
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Produk Paling Laris</CardTitle>
                            <CardDescription>Distribusi penjualan per produk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.product_sales}
                                            dataKey="revenue"
                                            nameKey="product"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
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
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                padding: '8px 12px'
                                            }}
                                            formatter={(value: number) => [formatRupiah(value), 'Revenue']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* TABEL KONFIRMASI PESANAN */}
                <motion.div variants={itemVariants}>
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Pesanan Terbaru</CardTitle>
                            <CardDescription>Daftar pesanan yang perlu dikonfirmasi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={orders} handleConfirm={handleConfirm} itemsPerPage={10} />
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}