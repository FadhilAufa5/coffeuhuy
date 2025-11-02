import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, MapPin, Phone, Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

interface Outlet {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  image?: string;
  open_time?: string;
  close_time?: string;
}

export default function OutletsIndex({
  outlets,
  flash,
}: {
  outlets: Outlet[];
  flash?: { success?: string };
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteOutlet, setDeleteOutlet] = useState<Outlet | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");

  const { data, setData, post, delete: destroy, reset, processing } = useForm({
    name: "",
    address: "",
    city: "",
    phone: "",
    open_time: "08:00",
    close_time: "22:00",
    image: null as File | null,
  });

  if (flash?.success && !toastMessage) {
    setToastMessage(flash.success);
    setTimeout(() => setToastMessage(""), 3000);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
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
    post("/outlets", {
      onSuccess: () => {
        reset();
        setPreview("");
        setShowCreateModal(false);
        setToastMessage("Outlet berhasil ditambahkan!");
        setTimeout(() => setToastMessage(""), 3000);
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteOutlet) return;
    destroy(`/outlets/${deleteOutlet.id}`, {
      onSuccess: () => {
        setToastMessage(`Outlet "${deleteOutlet.name}" berhasil dihapus!`);
        setTimeout(() => setToastMessage(""), 3000);
      },
    });
    setDeleteOutlet(null);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Outlets", href: "/outlets" }]}>
      <Head title="Outlets" />
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Kelola Outlets
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Kelola semua cabang Coffee Uhuy
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-red-800 hover:bg-red-700"
          >
            <Plus className="h-5 w-5" /> Tambah Outlet
          </Button>
        </div>

        {/* Outlets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outlets.map((outlet) => (
            <motion.div
              key={outlet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition">
                {outlet.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`/storage/${outlet.image}`}
                      alt={outlet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{outlet.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{outlet.address}</p>
                      <p className="font-medium">{outlet.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{outlet.phone}</span>
                  </div>
                  {outlet.open_time && outlet.close_time && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>
                        {outlet.open_time} - {outlet.close_time}
                      </span>
                    </div>
                  )}
                  <div className="pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteOutlet(outlet)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {outlets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada outlet. Tambahkan outlet pertama Anda!
            </p>
          </div>
        )}

        {/* Modal Create Outlet */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="p-6 max-w-lg w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold mb-6">Tambah Outlet Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Outlet</Label>
                    <Input
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      placeholder="Coffee Uhuy Cilandak"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Alamat</Label>
                    <Input
                      id="address"
                      name="address"
                      value={data.address}
                      onChange={handleChange}
                      placeholder="Jl. Cilandak Raya No. 123"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Kota</Label>
                    <Input
                      id="city"
                      name="city"
                      value={data.city}
                      onChange={handleChange}
                      placeholder="Jakarta Selatan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telepon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={data.phone}
                      onChange={handleChange}
                      placeholder="021-12345678"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="open_time">Jam Buka</Label>
                      <Input
                        id="open_time"
                        name="open_time"
                        type="time"
                        value={data.open_time}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="close_time">Jam Tutup</Label>
                      <Input
                        id="close_time"
                        name="close_time"
                        type="time"
                        value={data.close_time}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image">Gambar Outlet</Label>
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
                        className="h-32 w-full mt-2 object-cover rounded-lg"
                        alt="Preview"
                      />
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-800 hover:bg-red-700"
                    disabled={processing}
                  >
                    {processing ? "Menyimpan..." : "Simpan Outlet"}
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmDeleteModal
          isOpen={!!deleteOutlet}
          onClose={() => setDeleteOutlet(null)}
          onConfirm={handleConfirmDelete}
          message={
            deleteOutlet
              ? `Apakah yakin ingin menghapus outlet "${deleteOutlet.name}"?`
              : undefined
          }
        />

        {/* Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
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
