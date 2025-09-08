import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, message }: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded shadow-xl p-6 max-w-sm w-full relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button onClick={onClose} className="absolute top-2 right-2">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Hapus Produk</h2>
            <p className="mb-6">{message || 'Apakah yakin ingin menghapus produk ini?'}</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>Batal</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { onConfirm(); onClose(); }}>
                Hapus
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
