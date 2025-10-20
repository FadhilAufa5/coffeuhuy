import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

interface Order {
  id: number;
  invoice_number: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

interface Props {
  orders: Order[];
}

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return { label: "Lunas", color: "bg-green-100 text-green-700" };
    case "accepted":
      return { label: "Selesai", color: "bg-blue-100 text-blue-700" };
    case "pending":
      return { label: "Belum Dibayar", color: "bg-yellow-100 text-yellow-700" };
    case "rejected":
    case "cancelled":
      return { label: "Dibatalkan", color: "bg-red-100 text-red-700" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-700" };
  }
};

export default function HistoryTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700">Tidak Ada Transaksi</h3>
        <p className="text-gray-500 mt-2">Coba ubah filter atau rentang tanggal Anda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const status = getStatusLabel(order.status);

        return (
          <Card key={order.id} className="shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row justify-between items-start pb-2">
              <div>
                <CardTitle className="text-base font-bold text-blue-600">
                  {order.invoice_number}
                </CardTitle>
                <p className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}
              >
                {status.label}
              </span>
            </CardHeader>

            <CardContent>
              {/* Items */}
              <div className="border-t border-b divide-y my-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-500">
                        {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Rp {(item.subtotal ?? item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Ringkasan */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-600">
                  Metode Pembayaran:{" "}
                  <span className="font-semibold capitalize">
                    {order.payment_method || "N/A"}
                  </span>
                </span>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Total</span>
                  <p className="font-bold text-lg text-gray-900">
                    Rp {order.total.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 flex justify-end">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Cetak Struk
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
