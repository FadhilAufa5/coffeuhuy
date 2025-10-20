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
  name: string;
  quantity: number;
  price: number;
  subtotal?: number;
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

  // 🔹 Update filter value
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Apply filters (refresh data)
  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value && value !== "all")
    );

    router.get(route("kasir.historykasir"), activeFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  // 🔹 Enter key untuk cari invoice
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applyFilters();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* 🔺 Navbar */}
      <NavbarKasir />

      <Head title="Riwayat Kasir" />

      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
        {/* 🧾 Judul */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            📜 Riwayat Transaksi
          </h1>
          <p className="text-gray-500 mt-1">
            Lihat dan kelola semua transaksi yang telah dilakukan.
          </p>
        </header>

        {/* 🎛️ Filter Panel */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Filter Transaksi</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 🔍 Cari Invoice */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari No. Invoice..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10"
              />
            </div>

            {/* 📅 Rentang Tanggal */}
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filters.from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
              />
              <span className="text-gray-500">-</span>
              <Input
                type="date"
                value={filters.to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
              />
            </div>

            {/* 🏷️ Status */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Belum Dibayar</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="accepted">Selesai</SelectItem>
              </SelectContent>
            </Select>

            {/* 💳 Metode Pembayaran */}
            <Select
              value={filters.payment_method}
              onValueChange={(value) => handleFilterChange("payment_method", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pembayaran</SelectItem>
                <SelectItem value="Cash">Tunai</SelectItem>
                <SelectItem value="QRIS">QRIS</SelectItem>
                <SelectItem value="Debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>

          <CardFooter>
            <Button onClick={applyFilters} className="w-full md:w-auto">
              Terapkan Filter
            </Button>
          </CardFooter>
        </Card>

        {/* 🧮 Tabel Riwayat */}
        <HistoryTable orders={orders.data} />
      </main>
    </div>
  );
}
