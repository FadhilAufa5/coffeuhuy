import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductTable, { Product } from "@/components/ProductTable";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function CreateProduct({
  products,
  flash,
}: {
  products: Product[];
  flash?: { success?: string };
}) {
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("All");

  const { data, setData, post, delete: destroy, reset } = useForm({
    name: "",
    description: "",
    type: "",
    price: 0,
    image: null as File | null,
  });

  // Flash message (success)
  if (flash?.success && !toastMessage) {
    setToastMessage(flash.success);
    setTimeout(() => setToastMessage(""), 3000);
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData(
      name as keyof typeof data,
      name === "price" ? Number(value) : value
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setData("image", file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/products", {
      onSuccess: () => {
        reset();
        setPreview("");
        setShowCreateModal(false);
        setToastMessage("Produk berhasil ditambahkan!");
        setTimeout(() => setToastMessage(""), 3000);
      },
    });
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleConfirmDelete = () => {
    if (!deleteProduct) return;
    destroy(`/products/${deleteProduct.id}`, {
      onSuccess: () => {
        setToastMessage(`Produk "${deleteProduct.name}" berhasil dihapus!`);
        setTimeout(() => setToastMessage(""), 3000);
      },
    });
    setDeleteProduct(null);
  };

  return (
    <AppLayout>
      <Head title="Create Product" />
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold dark:text-white">
            Tambah Produk Baru 
            
          </h1>

         
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Plus className="h-5 w-5" /> Tambah Produk
          </Button>
        </div>

        {/* Product Table */}
        <Card className="p-4 shadow-lg bg-white dark:bg-gray-900 dark:text-gray-100">
          <ProductTable
            products={products}
            onView={setSelectedProduct}
            onDelete={handleDeleteClick}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        </Card>

        {/* Modal Create Product */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="p-6 max-w-md w-full bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-xl relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-2 right-2"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold mb-4">Tambah Produk</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Produk</Label>
                    <Input
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Input
                      id="description"
                      name="description"
                      value={data.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Jenis</Label>
                    <select
                      name="type"
                      value={data.type}
                      onChange={handleChange}
                      className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value="">-- Pilih Jenis --</option>
                      {[
                        "Coffee",
                        "Non-Coffee",
                        "Snack",
                        "Pastry",
                        "Heavy Meal",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="price">Harga</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={data.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Gambar Produk</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {preview && (
                      <img
                        src={preview}
                        className="h-32 w-32 mt-2 object-cover rounded-xl shadow"
                      />
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Simpan Produk
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Detail Produk */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="p-6 max-w-sm w-full bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-xl relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-2 right-2"
                >
                  <X className="h-5 w-5" />
                </button>
                {selectedProduct.image && (
                  <img
                    src={`/storage/${selectedProduct.image}`}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedProduct.description}
                </p>
                <p className="text-sm mt-1">
                  Jenis:{" "}
                  <span className="font-medium">{selectedProduct.type}</span>
                </p>
                <p className="text-lg font-semibold mt-2">
                  Rp {selectedProduct.price.toLocaleString()}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        
        <ConfirmDeleteModal
          isOpen={!!deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleConfirmDelete}
          message={
            deleteProduct
              ? `Apakah yakin ingin menghapus produk "${deleteProduct.name}"?`
              : undefined
          }
        />

        {/* Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
