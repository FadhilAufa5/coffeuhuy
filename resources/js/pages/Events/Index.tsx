import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Search, Calendar, Filter } from 'lucide-react';
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
  
  // Filter states
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');

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

  // Filter logic
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) || 
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesDate = filterDate ? event.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  return (
    <AppLayout>
      <Head title="Create Event" />
      <div className="p-6 space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kelola Event</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tambahkan dan kelola event menarik untuk Sobat Uhuy.
            </p>
          </div>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Tambah Event
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Cari nama event atau deskripsi..." 
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-auto md:min-w-[200px]">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="date" 
                        className="pl-9"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
                {(search || filterDate) && (
                    <Button 
                        variant="ghost" 
                        onClick={() => { setSearch(''); setFilterDate(''); }}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        Reset
                    </Button>
                )}
            </div>
        </Card>

        {/* Event Table */}
        <Card className="shadow-md overflow-hidden border-gray-200 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                <tr>
                    <th className="px-6 py-4 font-semibold w-24 text-center">Foto</th>
                    <th className="px-6 py-4 font-semibold min-w-[200px]">Nama Event</th>
                    <th className="px-6 py-4 font-semibold min-w-[150px]">Tanggal</th>
                    <th className="px-6 py-4 font-semibold min-w-[300px]">Deskripsi</th>
                    <th className="px-6 py-4 font-semibold text-center w-[180px]">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((e) => (
                    <tr
                        key={e.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                        {/* Foto */}
                        <td className="px-6 py-4">
                        <div className="flex justify-center">
                            {e.image ? (
                            <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                <img
                                src={`/storage/${e.image}`}
                                alt={e.name}
                                className="h-full w-full object-cover"
                                />
                            </div>
                            ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                <span className="text-xs">No Img</span>
                            </div>
                            )}
                        </div>
                        </td>

                        {/* Nama */}
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {e.name}
                        </td>

                        {/* Tanggal */}
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {formatDate(e.date)}
                            </div>
                        </td>

                        {/* Deskripsi */}
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {e.description}
                        </td>

                        {/* Aksi */}
                        <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                            <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEvent(e)}
                            className="h-8 px-3 text-xs"
                            >
                            Detail
                            </Button>
                            <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteEvent(e)}
                            className="h-8 px-3 text-xs"
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
                        className="px-6 py-12 text-center text-muted-foreground"
                    >
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                                <Filter className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="font-medium">Tidak ada event ditemukan</p>
                            <p className="text-xs">Coba ubah kata kunci pencarian atau filter tanggal.</p>
                        </div>
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>
        </Card>

        {/* Modal Create Event */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="p-6 max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl relative border border-gray-200 dark:border-gray-800"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
              >
                <button 
                    onClick={() => setShowCreateModal(false)} 
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
                <h2 className="text-xl font-bold mb-1">Tambah Event Baru</h2>
                <p className="text-sm text-muted-foreground mb-6">Isi detail event di bawah ini.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Event</Label>
                    <Input id="name" name="name" placeholder="Contoh: Live Music Malam Minggu" value={data.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal Pelaksanaan</Label>
                    <Input id="date" name="date" type="date" value={data.date} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Singkat</Label>
                    <Input id="description" name="description" placeholder="Deskripsi event..." value={data.description} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Poster / Foto Event</Label>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative">
                        <Input 
                            id="image" 
                            name="image" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {preview ? (
                            <img src={preview} className="h-32 mx-auto object-cover rounded shadow-sm" />
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">Klik untuk upload</span> atau drag & drop
                            </div>
                        )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="p-0 max-w-sm w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl relative overflow-hidden border border-gray-200 dark:border-gray-800"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
              >
                <button 
                    onClick={() => setSelectedEvent(null)} 
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                    {selectedEvent.image ? (
                    <img
                        src={`/storage/${selectedEvent.image}`}
                        alt={selectedEvent.name}
                        className="w-full h-full object-cover"
                    />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{selectedEvent.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedEvent.date)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {selectedEvent.description || "Tidak ada deskripsi."}
                    </p>
                </div>
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
              className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl font-medium z-[100]"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
