import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";

// 🧩 UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🧭 Icons & Layout
import { Search } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <NavbarKasir />
      <Head title="Riwayat Kasir" />

      <main className="flex-1 p-4 md:p-6 space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Riwayat Transaksi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lihat semua transaksi yang telah dilakukan
            <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
              ({orders.total} transaksi)
            </span>
          </p>
        </header>

        {/* Filter Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type="text"
                  placeholder="Cari invoice atau nama pembeli..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-9"
                />
              </div>

              {/* Status */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="accepted">Selesai</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Method */}
              <Select
                value={filters.payment_method}
                onValueChange={(value) => handleFilterChange("payment_method", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Metode" />
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <Input
                  type="date"
                  value={filters.from}
                  onChange={(e) => handleFilterChange("from", e.target.value)}
                  className="text-sm"
                  placeholder="Dari tanggal"
                />
                <span className="text-gray-400 dark:text-gray-500">—</span>
                <Input
                  type="date"
                  value={filters.to}
                  onChange={(e) => handleFilterChange("to", e.target.value)}
                  className="text-sm"
                  placeholder="Sampai tanggal"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  onClick={applyFilters} 
                  size="sm" 
                  className="flex-1 sm:flex-none bg-red-800 hover:bg-red-700"
                >
                  Terapkan Filter
                </Button>
                <Button 
                  onClick={resetFilters} 
                  size="sm" 
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <HistoryTable orders={orders.data} />

        {/* Pagination */}
        {orders.last_page > 1 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Menampilkan halaman {orders.current_page} dari {orders.last_page}
                  <span className="ml-2">
                    (Total: {orders.total} transaksi)
                  </span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {orders.links.map((link, index) => {
                    if (!link.url) return null;
                    
                    const isPrev = link.label.includes('Previous');
                    const isNext = link.label.includes('Next');
                    const label = isPrev ? '← Prev' : isNext ? 'Next →' : link.label;

                    return (
                      <Button
                        key={index}
                        onClick={() => handlePageChange(link.url!)}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        className={link.active ? "bg-red-800 hover:bg-red-700" : ""}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
