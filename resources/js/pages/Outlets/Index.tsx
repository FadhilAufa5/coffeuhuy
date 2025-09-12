import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';


interface Outlet {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  image?: string;
}

export default function CreateOutlet({
  outlets,
  flash,
}: {
  outlets: Outlet[];
  flash?: { success?: string };
}) {
  const [preview, setPreview] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [deleteOutlet, setDeleteOutlet] = useState<Outlet | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, setData, post, delete: destroy, reset, processing } = useForm({
    name: '',
    address: '',
    city: '',
    phone: '',
    image: null as File | null,
  });

  // flash success dari backend
  if (flash?.success && !toastMessage) {
    setToastMessage(flash.success);
    setTimeout(() => setToastMessage(''), 3000);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setData('image', file);
    }
  };

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/outlets', {
      onSuccess: () => {
        reset();
        setPreview('');
        setShowCreateModal(false);
        setToastMessage('Event berhasil ditambahkan!');
        setTimeout(() => setToastMessage(''), 3000);
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteOutlet) return;
    destroy(`/outlets/${deleteOutlet.id}`, {
      onSuccess: () => {
        setToastMessage(`Outlet "${deleteOutlet.name}" berhasil dihapus!`);
        setTimeout(() => setToastMessage(''), 3000);
      },
       method: 'delete',
    });
    setDeleteOutlet(null);
  };

  return (
    <AppLayout>
      <Head title="Create Outlet" />
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tambah Outlet Baru</h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-700"
          >
            <Plus className="h-5 w-5" /> Tambah Outlet
          </Button>
        </div>

        {/* Table */}
        <Card className="p-4 shadow-lg overflow-x-auto">
          <table className="w-full table-auto text-sm text-left border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 w-20 text-center">Foto</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Alamat</th>
                <th className="px-4 py-3">Kota</th>
                <th className="px-4 py-3">Telepon</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {outlets.length > 0 ? (
                outlets.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-center">
                      {o.image ? (
                        <img
                          src={`/storage/${o.image}`}
                          alt={o.name}
                          className="h-12 w-12 object-cover rounded-md border mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{o.name}</td>
                    <td className="px-4 py-3">{o.address}</td>
                    <td className="px-4 py-3">{o.city}</td>
                    <td className="px-4 py-3">{o.phone}</td>
                    <td className="px-4 py-3 flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOutlet(o)}
                        className="px-3"
                      >
                        Lihat
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteOutlet(o)}
                        className="px-3"
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    Belum ada outlet ditambahkan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Modal Create */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="p-6 max-w-md w-full bg-white rounded shadow-xl relative"
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

                <h2 className="text-2xl font-bold mb-4">Tambah Outlet</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Outlet</Label>
                    <Input
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
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
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Foto Outlet</Label>
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
                        className="h-32 w-32 mt-2 object-cover rounded"
                      />
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-black text-white hover:bg-gray-700"
                  >
                    {processing ? 'Menyimpan...' : 'Simpan Outlet'}
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Detail */}
        <AnimatePresence>
          {selectedOutlet && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="p-6 max-w-sm w-full bg-white rounded shadow-xl relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  onClick={() => setSelectedOutlet(null)}
                  className="absolute top-2 right-2"
                >
                  <X className="h-5 w-5" />
                </button>
                {selectedOutlet.image && (
                  <img
                    src={`/storage/${selectedOutlet.image}`}
                    alt={selectedOutlet.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-xl font-bold">{selectedOutlet.name}</h3>
                <p className="text-gray-500">{selectedOutlet.address}</p>
                <p className="text-sm mt-1">Kota: {selectedOutlet.city}</p>
                <p className="text-sm mt-1">Telepon: {selectedOutlet.phone}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Delete */}
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
              className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
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
