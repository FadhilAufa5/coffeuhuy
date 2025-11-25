import React from "react";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, CreditCard, ShoppingBag } from "lucide-react";

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
  const variant = {
    paid: "success",
    accepted: "default",
    pending: "warning",
  }[status.toLowerCase()] || "secondary";

  const label = {
    paid: "Lunas",
    accepted: "Selesai",
    pending: "Pending",
  }[status.toLowerCase()] || status;

  // Map custom variants to Badge variants if needed, or use standard ones
  // Assuming standard shadcn badge variants: default, secondary, destructive, outline
  // We'll use specific classes for colors since standard variants might not cover all cases perfectly
  let className = "";
  switch (status.toLowerCase()) {
    case 'paid':
      className = "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400";
      break;
    case 'accepted':
      className = "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      break;
    case 'pending':
      className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
      break;
    default:
      className = "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";
  }

  return { className, label };
};

export default function HistoryTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Belum ada transaksi</h3>
        <p className="text-sm text-muted-foreground mt-1">Transaksi yang dilakukan akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => {
        const { className, label } = getStatusBadge(order.status);
        const paymentInfo = order.payment_method === "Debit" && order.bank
          ? `${order.payment_method} - ${order.bank}`
          : order.payment_method || "-";

        return (
          <Card key={order.id} className="overflow-hidden transition-all hover:shadow-md border-gray-200 dark:border-gray-800">
            <CardHeader className="p-4 pb-2 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white font-mono">
                      {order.invoice_number}
                    </h3>
                    <Badge variant="outline" className={`border-0 ${className}`}>
                      {label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {order.buyer_name && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {order.buyer_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Total Pembayaran</p>
                    <p className="text-lg font-bold text-primary">
                        {formatRupiah(order.total * 1.11)}
                    </p>
                </div>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="p-4">
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          {item.product_image ? (
                            <img 
                              src={item.product_image} 
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x {formatRupiah(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Tidak ada detail item</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{paymentInfo}</span>
                    </div>
                    <span>Subtotal: {formatRupiah(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
