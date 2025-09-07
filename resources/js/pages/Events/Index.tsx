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
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Create Event', href: '#' },
];

interface Event {
  name: string;
  description: string;
  date: string;
  image?: string;
  isNew?: boolean;
}

export default function CreateEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Event>({
    name: '',
    description: '',
    date: '',
    image: '',
    isNew: true,
  });
  const [preview, setPreview] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEvents([...events, form]);
    setForm({ name: '', description: '', date: '', image: '', isNew: true });
    setPreview('');
  };

  const handleDelete = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Event" />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Add new events to your CoffeeShop schedule
        </p>

        {/* Form Create Event */}
        <Card className="p-6 shadow-lg space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Event</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Grand Opening"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Tanggal Event</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Deskripsi singkat event"
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Foto Event</Label>
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
                  alt="Preview"
                  className="mt-2 h-32 w-32 object-cover rounded-md border"
                />
              )}
            </div>

            <Button type="submit" className="w-full bg-[#1b1b18] text-white hover:bg-[#333]">
              Simpan Event
            </Button>
          </form>
        </Card>

        {/* Tabel Event */}
        <Card className="p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Daftar Event</h2>
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border p-2 text-left">Foto</th>
                <th className="border p-2 text-left">Nama Event</th>
                <th className="border p-2 text-left">Tanggal</th>
                <th className="border p-2 text-left">Deskripsi</th>
                <th className="border p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((e, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="border p-2">
                      {e.image ? (
                        <img src={e.image} alt={e.name} className="h-16 w-16 object-cover rounded" />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="border p-2 flex items-center gap-2">
                      {e.name}
                      {e.isNew && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                        >
                          New
                        </motion.span>
                      )}
                    </td>
                    <td className="border p-2">{e.date}</td>
                    <td className="border p-2">{e.description}</td>
                    <td className="border p-2 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedEvent(e)}
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
                  <td colSpan={5} className="border p-4 text-center text-gray-500">
                    Belum ada event ditambahkan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Modal Preview */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-sm w-full relative bg-white dark:bg-gray-900 shadow-xl rounded-xl">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
              {selectedEvent.image && (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{selectedEvent.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{selectedEvent.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tanggal: {selectedEvent.date}</p>
              {selectedEvent.isNew && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                >
                  New
                </motion.span>
              )}
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
