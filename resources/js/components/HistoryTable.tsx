import React from "react";
import { formatRupiah } from "@/lib/utils";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  product_image?: string;
}

interface Order {
  id: number;
  invoice_number: string;
  total: number;
  status: string;
  payment_method: string;
  bank?: string;
  buyer_name?: string;
  created_at: string;
  items: OrderItem[];
}

interface Props {
  orders: Order[];
}

const getStatusBadge = (status: string) => {
  const styles = {
    paid: "bg-green-50 text-green-700 border-green-200",
    accepted: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  }[status.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200";

  const labels = {
    paid: "Lunas",
    accepted: "Selesai",
    pending: "Pending",
  }[status.toLowerCase()] || status;

  return { styles, labels };
};

export default function HistoryTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Tidak ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const { styles, labels } = getStatusBadge(order.status);
        const paymentInfo = order.payment_method === "Debit" && order.bank
          ? `${order.payment_method} - ${order.bank}`
          : order.payment_method || "-";

        return (
          <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{order.invoice_number}</h3>
                {order.buyer_name && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">👤</span>
                    {order.buyer_name}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(order.created_at).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded border ${styles}`}>
                {labels}
              </span>
            </div>

            {/* Items Summary */}
            <div className="space-y-2 mb-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      {item.product_image && (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{item.product_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.quantity}x @ {formatRupiah(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada item</p>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{paymentInfo}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal: {formatRupiah(order.total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">PPN (11%)</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{formatRupiah(order.total * 0.11)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-800">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">{formatRupiah(order.total * 1.11)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
