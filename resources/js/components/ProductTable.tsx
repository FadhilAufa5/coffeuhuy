import { Button } from '@/components/ui/button';

export interface Product {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  image?: string;
}

// warna label per jenis
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
  const filteredProducts =
    filterType === 'All'
      ? products
      : products.filter((p) => p.type === filterType);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex justify-end">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">Semua</option>
          {['Coffee', 'Non-Coffee', 'Snack', 'Pastry', 'Heavy Meal'].map(
            (t) => (
              <option key={t} value={t}>
                {t}
              </option>
            )
          )}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 w-20 text-center">Foto</th>
              <th className="px-4 py-3 min-w-[150px]">Nama</th>
              <th className="px-4 py-3 min-w-[120px]">Jenis</th>
              <th className="px-4 py-3 min-w-[120px]">Harga</th>
              <th className="px-4 py-3 min-w-[250px]">Deskripsi</th>
              <th className="px-4 py-3 text-center min-w-[160px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {/* Foto */}
                  <td className="px-4 py-3 text-center">
                    {p.image ? (
                      <img
                        src={`/storage/${p.image}`}
                        alt={p.name}
                        className="h-12 w-12 object-cover rounded-md border mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Nama */}
                  <td className="px-4 py-3 font-medium">{p.name}</td>

                  {/* Jenis dengan badge warna */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        typeColors[p.type] || "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>

                  {/* Harga */}
                  <td className="px-4 py-3">
                    Rp {p.price.toLocaleString()}
                  </td>

                  {/* Deskripsi */}
                  <td className="px-4 py-3 max-w-xs truncate">
                    {p.description}
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(p)}
                        className="px-3"
                      >
                        Lihat
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(p)}
                        className="px-3"
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
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  Belum ada produk ditambahkan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
