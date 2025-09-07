import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Trash2, X } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';


const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Create Outlet', href: '#' },
];

interface Outlet {
  name: string;
  address: string;
  city: string;
  phone: string;
  image?: string;
}

export default function CreateOutlet() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [form, setForm] = useState<Outlet>({
    name: '',
    address: '',
    city: '',
    phone: '',
    image: '',
  });
  const [preview, setPreview] = useState<string>('');
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{open: boolean, index?: number}>({open: false});
  const [confirmSave, setConfirmSave] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setForm({ ...form, image: url });
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    setForm({ ...form, image: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmSave(true); // trigger confirmation popup
  };

  const confirmSaveAction = () => {
    setOutlets([...outlets, form]);
    setForm({ name: '', address: '', city: '', phone: '', image: '' });
    setPreview('');
    setConfirmSave(false);
  };

  const handleDelete = (index: number) => {
    setConfirmDelete({ open: true, index });
  };

  const confirmDeleteAction = () => {
    if (confirmDelete.index !== undefined) {
      setOutlets(outlets.filter((_, i) => i !== confirmDelete.index));
    }
    setConfirmDelete({ open: false });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Outlet" />
      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Tambah Outlet Baru
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Kelola lokasi outlet CoffeeShop dengan mudah. Tambahkan informasi outlet lengkap di sini.
        </p>

        {/* Form */}
        <Card className="p-8 shadow-xl rounded-3xl bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <Label htmlFor="name">Nama Outlet</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="CoffeeShop Uhuy Central"
                required
                className="shadow-sm rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="city">Kota</Label>
              <Input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Jakarta"
                required
                className="shadow-sm rounded-xl"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Jl. Contoh No.123, Jakarta"
                required
                className="shadow-sm rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08123456789"
                required
                className="shadow-sm rounded-xl"
              />
            </div>

            <div className="flex flex-col items-center md:items-start">
              <Label htmlFor="image">Foto Outlet</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-2xl shadow-lg h-48 w-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-300"
              >
                Simpan Outlet
              </Button>
            </div>
          </form>
        </Card>

        {/* Tabel */}
        <Card className="p-6 shadow-xl rounded-3xl bg-white dark:bg-gray-900 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Daftar Outlet</h2>
          <table className="w-full text-left border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Foto</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Nama Outlet</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Alamat</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Kota</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Telepon</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {outlets.length > 0 ? (
                outlets.map((o, index) => (
                  <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                      {o.image ? <img src={o.image} alt={o.name} className="h-16 w-16 object-cover rounded-lg shadow-sm" /> : '-'}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{o.name}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{o.address}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{o.city}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{o.phone}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedOutlet(o)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Belum ada outlet ditambahkan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Modal Preview */}
        {selectedOutlet && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-sm w-full relative bg-white dark:bg-gray-900 shadow-xl rounded-3xl">
              <button onClick={() => setSelectedOutlet(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <X className="h-5 w-5" />
              </button>
              {selectedOutlet.image && (
                <img src={selectedOutlet.image} alt={selectedOutlet.name} className="w-full h-48 object-cover rounded-2xl mb-4 shadow-md"/>
              )}
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{selectedOutlet.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Alamat: {selectedOutlet.address}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Kota: {selectedOutlet.city}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Telepon: {selectedOutlet.phone}</p>
            </Card>
          </div>
        )}

        {/* Confirm Delete */}
        <ConfirmModal
          open={confirmDelete.open}
          title="Hapus Outlet"
          message="Apakah anda yakin ingin menghapus outlet ini?"
          onCancel={() => setConfirmDelete({ open: false })}
          onConfirm={confirmDeleteAction}
        />

        {/* Confirm Save */}
        <ConfirmModal
          open={confirmSave}
          title="Simpan Outlet"
          message="Apakah anda yakin ingin menyimpan outlet ini?"
          onCancel={() => setConfirmSave(false)}
          onConfirm={confirmSaveAction}
        />

      </div>
    </AppLayout>
  );
}
