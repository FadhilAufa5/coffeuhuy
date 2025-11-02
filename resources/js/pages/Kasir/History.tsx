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
  created_at: string;
  items: OrderItem[];
}

interface PageProps {
  orders: {
    data: Order[];
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
    
    // Hanya tambahkan filter yang memiliki nilai
    if (filters.search) activeFilters.search = filters.search;
    if (filters.from) activeFilters.from = filters.from;
    if (filters.to) activeFilters.to = filters.to;
    if (filters.status && filters.status !== "all") activeFilters.status = filters.status;
    if (filters.payment_method && filters.payment_method !== "all") {
      activeFilters.payment_method = filters.payment_method;
    }

    router.get(route("kasir.historykasir"), activeFilters, {
      preserveState: false,
      preserveScroll: false,
    });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applyFilters();
  };

  const resetFilters = () => {
    setFilters({
      from: "",
      to: "",
      status: "all",
      payment_method: "all",
      search: "",
    });
    router.get(route("kasir.historykasir"), {}, {
      preserveState: false,
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
          <p className="text-sm text-gray-500">
            Lihat semua transaksi yang telah dilakukan
          </p>
        </header>

        {/* Filter Section - More Compact */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari invoice..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-9"
                />
              </div>

              {/* Status */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
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
                  <SelectValue placeholder="Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                  <SelectItem value="Debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 mt-3">
              <Input
                type="date"
                value={filters.from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
                className="text-sm"
              />
              <span className="text-gray-400">—</span>
              <Input
                type="date"
                value={filters.to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
                className="text-sm"
              />
              <Button onClick={applyFilters} size="sm" className="ml-2">
                Filter
              </Button>
              <Button onClick={resetFilters} size="sm" variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <HistoryTable orders={orders.data} />
      </main>
    </div>
  );
}
