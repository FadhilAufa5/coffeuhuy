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

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  image?: string;
  is_new?: boolean;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CreateEvent({ events, flash }: { events: Event[]; flash?: { success?: string } }) {
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const { data, setData, post, delete: destroy, reset } = useForm({
    name: '',
    description: '',
    date: '',
    image: null as File | null,
  });

  // Flash message (success)
  if (flash?.success && !toastMessage) {
    setToastMessage(flash.success);
    setTimeout(() => setToastMessage(''), 3000);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    post('/events', {
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
    if (!deleteEvent) return;
    destroy(`/events/${deleteEvent.id}`, {
      onSuccess: () => {
        setToastMessage(`Event "${deleteEvent.name}" berhasil dihapus!`);
        setTimeout(() => setToastMessage(''), 3000);
      },
    });
    setDeleteEvent(null);
  };

  return (
    <AppLayout>
      <Head title="Create Event" />
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tambah Event Baru</h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-700"
          >
            <Plus className="h-5 w-5" /> Tambah Event
          </Button>
        </div>

        {/* Event Table */}
    <Card className="p-4 shadow-lg overflow-x-auto">
  <table className="w-full table-auto text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg">
    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
      <tr>
        <th className="px-4 py-3 w-20 text-center">Foto</th>
        <th className="px-4 py-3 min-w-[150px]">Nama</th>
        <th className="px-4 py-3 min-w-[120px]">Tanggal</th>
        <th className="px-4 py-3 min-w-[250px]">Deskripsi</th>
        <th className="px-4 py-3 text-center min-w-[160px]">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {events.length > 0 ? (
        events.map((e) => (
          <tr
            key={e.id}
            className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {/* Foto */}
            <td className="px-4 py-3 text-center">
              {e.image ? (
                <img
                  src={`/storage/${e.image}`}
                  alt={e.name}
                  className="h-12 w-12 object-cover rounded-md border mx-auto"
                />
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </td>

            {/* Nama */}
            <td className="px-4 py-3 font-medium">{e.name}</td>

            {/* Tanggal */}
            <td className="px-4 py-3">{e.date}</td>

            {/* Deskripsi */}
            <td className="px-4 py-3 max-w-xs truncate">{e.description}</td>

            {/* Aksi */}
            <td className="px-4 py-3">
              <div className="flex justify-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedEvent(e)}
                  className="px-3"
                >
                  Lihat
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteEvent(e)}
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
            colSpan={5}
            className="px-4 py-6 text-center text-gray-500 italic"
          >
            Belum ada event ditambahkan
          </td>
        </tr>
      )}
    </tbody>
  </table>
</Card>


        {/* Modal Create Event */}
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
                <button onClick={() => setShowCreateModal(false)} className="absolute top-2 right-2">
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold mb-4">Tambah Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Event</Label>
                    <Input id="name" name="name" value={data.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="date">Tanggal</Label>
                    <Input id="date" name="date" type="date" value={data.date} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Input id="description" name="description" value={data.description} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="image">Foto Event</Label>
                    <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                    {preview && <img src={preview} className="h-32 w-32 mt-2 object-cover rounded" />}
                  </div>
                  <Button type="submit" className="w-full bg-black text-white hover:bg-gray-700">
                    Simpan Event
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Detail Event */}
        <AnimatePresence>
          {selectedEvent && (
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
                <button onClick={() => setSelectedEvent(null)} className="absolute top-2 right-2">
                  <X className="h-5 w-5" />
                </button>
                {selectedEvent.image && (
                  <img
                    src={`/storage/${selectedEvent.image}`}
                    alt={selectedEvent.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-xl font-bold">{selectedEvent.name}</h3>
                <p className="text-gray-500">{selectedEvent.description}</p>
                <p className="text-sm mt-1">Tanggal: {formatDate(selectedEvent.date)}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Delete */}
        <ConfirmDeleteModal
          isOpen={!!deleteEvent}
          onClose={() => setDeleteEvent(null)}
          onConfirm={handleConfirmDelete}
          message={deleteEvent ? `Apakah yakin ingin menghapus event "${deleteEvent.name}"?` : undefined}
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
