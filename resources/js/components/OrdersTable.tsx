import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Order {
  id: number;
  total: number;
  payment_method?: string;
  buyer_name?: string;
  status: string;
}

interface OrdersTableProps {
  orders: Order[];
  handleConfirm: (id: number) => void;
  itemsPerPage?: number;
}

const ResponsivePagination: React.FC<{
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4 gap-2 items-center">
      {/* Desktop: Previous / Next buttons */}
      <div className="hidden sm:flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Previous
        </button>

        <span className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Next
        </button>
      </div>

      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          {pages.map((page) => (
            <option key={page} value={page}>
              Halaman {page}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  handleConfirm,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-green-600" /> Konfirmasi Pembayaran
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Pembeli</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Konfirmasi</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, idx) => (
                    <tr
                      key={order.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                    >
                      <td className="py-3 px-4">{startIndex + idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {order.buyer_name || '-'}
                      </td>
                      <td className="py-3 px-4">Rp {Number(order.total).toLocaleString()}</td>
                      <td className="py-3 px-4">{order.payment_method || '-'}</td>
                      <td className="py-3 px-4 capitalize">{order.status}</td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          disabled={order.status !== 'paid'}
                          onChange={() => handleConfirm(order.id)}
                          className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-400"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-5 text-center text-gray-500 dark:text-gray-400 text-sm"
                    >
                      Tidak ada pesanan untuk dikonfirmasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Responsive Pagination */}
      <ResponsivePagination
        totalItems={orders.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};
