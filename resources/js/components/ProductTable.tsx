import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Search, Box} from "lucide-react"

export interface Product {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  image?: string;
}

const typeColors: Record<string, string> = {
  Coffee: "bg-yellow-700 text-white",
  "Non-Coffee": "bg-blue-500 text-white",
  Snack: "bg-green-500 text-white",
  Pastry: "bg-pink-500 text-white",
  "Heavy Meal": "bg-orange-500 text-white",
};

export default function ProductTable({
  products,
  onView,
  onDelete,
  filterType,
  setFilterType,
}: {
  products: Product[];
  onView: (p: Product) => void;
  onDelete: (p: Product) => void;
  filterType: string;
  setFilterType: (t: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  // filter & search
  const filteredProducts = products.filter((p) => {
    const matchesType = filterType === "All" || p.type === filterType;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    return matchesType && matchesSearch;
  });

  // pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <input
          
          type="text"
          placeholder= "Cari produk..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/3 border rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
        />
        <div className="flex items-center gap-3">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Total: {filteredProducts.length}
          </p>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="All">Semua</option>
            {["Coffee", "Non-Coffee", "Snack", "Pastry", "Heavy Meal"].map(
              (t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto text-xs sm:text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-3 py-2 w-10 text-center">No</th>
              <th className="px-3 py-2 w-16 text-center">Foto</th>
              <th className="px-3 py-2 min-w-[120px]">Nama</th>
              <th className="px-3 py-2 min-w-[90px]">Jenis</th>
              <th className="px-3 py-2 min-w-[90px]">Harga</th>
              <th className="px-3 py-2 min-w-[180px]">Deskripsi</th>
              <th className="px-3 py-2 text-center min-w-[130px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((p, idx) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-3 py-2 text-center">
                    {startIndex + idx + 1}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {p.image ? (
                      <img
                        src={`/storage/${p.image}`}
                        alt={p.name}
                        className="h-10 w-10 object-cover rounded-md border mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                        typeColors[p.type] || "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td className="px-3 py-2">Rp {p.price.toLocaleString()}</td>
                  <td className="px-3 py-2 max-w-xs truncate">
                    {p.description}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(p)}
                        className="px-2 text-xs"
                      >
                        Lihat
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(p)}
                        className="px-2 text-xs"
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  <Box className="w-12 h-12 mx-auto"/>
                  Tidak ada produk ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card - Mobile */}
      <div className="grid gap-3 md:hidden">
        {currentProducts.length > 0 ? (
          currentProducts.map((p, idx) => (
            <div
              key={p.id}
              className="border rounded-lg p-3 bg-white dark:bg-gray-900 shadow text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                {p.image ? (
                  <img
                    src={`/storage/${p.image}`}
                    alt={p.name}
                    className="h-12 w-12 object-cover rounded-md border"
                  />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-200 text-gray-400 rounded-md text-xs">
                    No Img
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold">
                    {startIndex + idx + 1}. {p.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Rp {p.price.toLocaleString()}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                      typeColors[p.type] || "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {p.type}
                  </span>
                </div>
              </div>
              {p.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                  {p.description}
                </p>
              )}
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(p)}
                  className="text-xs px-2"
                >
                  Lihat
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(p)}
                  className="text-xs px-2"
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic text-sm">
            Tidak ada produk ditemukan
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-3">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredProducts.length)} dari{" "}
            {filteredProducts.length}
          </p>
          <div className="flex space-x-1">
            <Button
              size="sm"
              className="text-xs px-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                size="sm"
                className={`text-xs px-2 ${
                  currentPage === i + 1
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              className="text-xs px-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
