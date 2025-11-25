import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";

// 🧩 UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// 🧭 Icons & Layout
import { Search, Filter, Calendar, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import NavbarKasir from "@/components/NavbarKasir";

// 📦 Custom Components
import HistoryTable from "@/components/HistoryTable";

// 🧠 Type Definitions
interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  product_image?: string;
}

interface Order {
  id: number;
  invoice_number: string;
  total: number;
  status: string;
  payment_method: string;
  buyer_name?: string;
  created_at: string;
  items: OrderItem[];
}

interface PageProps {
  orders: {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  filters: {
    from?: string;
    to?: string;
    status?: string;
    payment_method?: string;
    search?: string;
  };
}

export default function History() {
  const { orders, filters: initialFilters } = usePage<PageProps>().props;

  const [filters, setFilters] = useState({
    from: initialFilters.from || "",
    to: initialFilters.to || "",
    status: initialFilters.status || "all",
    payment_method: initialFilters.payment_method || "all",
    search: initialFilters.search || "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const activeFilters: Record<string, string> = {};
    
    if (filters.search.trim()) activeFilters.search = filters.search.trim();
    if (filters.from) activeFilters.from = filters.from;
    if (filters.to) activeFilters.to = filters.to;
    if (filters.status && filters.status !== "all") activeFilters.status = filters.status;
    if (filters.payment_method && filters.payment_method !== "all") {
      activeFilters.payment_method = filters.payment_method;
    }

    router.get("/kasir/historykasir", activeFilters, {
      preserveState: true,
      preserveScroll: false,
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  };

  const resetFilters = () => {
    setFilters({
      from: "",
      to: "",
      status: "all",
      payment_method: "all",
      search: "",
    });
    router.get("/kasir/historykasir", {}, {
      preserveState: true,
      preserveScroll: false,
    });
  };

  const handlePageChange = (url: string) => {
    router.get(url, {}, {
      preserveState: true,
      preserveScroll: false,
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
      <NavbarKasir />
      <Head title="Riwayat Kasir" />

      <motion.main 
        className="container mx-auto p-4 md:p-6 space-y-6 max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Riwayat Transaksi
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola dan pantau semua transaksi penjualan Anda.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-lg border shadow-sm">
            <span className="text-xs font-medium px-2 text-muted-foreground">Total Transaksi:</span>
            <span className="text-sm font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                {orders.total}
            </span>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        <CardTitle className="text-base">Filter & Pencarian</CardTitle>
                    </div>
                    {(filters.search || filters.status !== 'all' || filters.payment_method !== 'all' || filters.from || filters.to) && (
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs text-muted-foreground hover:text-destructive">
                            <RefreshCcw className="w-3 h-3 mr-1.5" />
                            Reset Filter
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search */}
                <div className="md:col-span-4 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Cari invoice / nama..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={applyFilters} size="icon" className="shrink-0 bg-primary/90 hover:bg-primary">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                    <Select
                        value={filters.status}
                        onValueChange={(value) => handleFilterChange("status", value)}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Lunas</SelectItem>
                        <SelectItem value="accepted">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Payment Method */}
                <div className="md:col-span-2">
                    <Select
                        value={filters.payment_method}
                        onValueChange={(value) => handleFilterChange("payment_method", value)}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Metode" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">Semua Metode</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="QRIS">QRIS</SelectItem>
                        <SelectItem value="Debit">Debit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Range */}
                <div className="md:col-span-4 flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            type="date"
                            value={filters.from}
                            onChange={(e) => handleFilterChange("from", e.target.value)}
                            className="text-xs"
                        />
                    </div>
                    <div className="relative flex-1">
                        <Input
                            type="date"
                            value={filters.to}
                            onChange={(e) => handleFilterChange("to", e.target.value)}
                            className="text-xs"
                        />
                    </div>
                    <Button onClick={applyFilters} variant="secondary" className="shrink-0">
                        Filter
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
            <HistoryTable orders={orders.data} />
        </motion.div>

        {/* Pagination */}
        {orders.last_page > 1 && (
          <motion.div variants={itemVariants} className="flex justify-center py-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm border">
                {orders.links.map((link, index) => {
                    if (!link.url && !link.label.includes('Previous') && !link.label.includes('Next')) return null;
                    
                    const isPrev = link.label.includes('Previous');
                    const isNext = link.label.includes('Next');
                    
                    if (isPrev) {
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                size="icon"
                                onClick={() => link.url && handlePageChange(link.url)}
                                disabled={!link.url}
                                className="w-8 h-8"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        );
                    }
                    
                    if (isNext) {
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                size="icon"
                                onClick={() => link.url && handlePageChange(link.url)}
                                disabled={!link.url}
                                className="w-8 h-8"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={index}
                            variant={link.active ? "default" : "ghost"}
                            size="sm"
                            onClick={() => link.url && handlePageChange(link.url)}
                            className={`w-8 h-8 p-0 ${link.active ? 'bg-primary text-primary-foreground' : ''}`}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    );
                })}
            </div>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
