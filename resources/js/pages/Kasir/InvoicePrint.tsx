import React from "react";
import { formatRupiah } from "@/lib/utils";
import QRCode from "react-qr-code";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  buyer_name: string;
  items: OrderItem[];
  total: number;
 
}

interface Props {
  order: Order;
  paymentMethod: string;
  cashGiven?: number;
  change?: number;
}

export default function InvoicePrint80mm({
  order,
  paymentMethod,
  cashGiven,
  change,
}: Props) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  return (
    <div className="hidden print:block text-[11px] font-mono text-gray-800 w-[80mm] mx-auto p-3">
      {/* === Header === */}
      <div className="text-center mb-2">
        {/* Logo */}
        <img
          src="/logouhuy3.png" // ganti sesuai logo kamu
          alt="Logo Cafe"
          className="w-16 h-16 mx-auto mb-1 object-contain"
        />
        <div className="text-xl font-extrabold">KOPI UHUY</div>
        <div className="text-[10px]">Jl. Padjajaran. 45, Bogor</div>
        <div className="text-[10px] mb-1">Telp. (+62) 816-7427-41</div>
        <div className="text-[10px] font-semibold">========================================</div>
      </div>

      {/* === Info Order === */}
      <div className="text-[10px] mb-2">\
        <div className="flex justify-between">
          <span>No. Order:</span>
          <span>#{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Pembeli:</span>
          <span>{order.buyer_name || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Tanggal:</span>
          <span>{new Date().toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="text-[10px] font-semibold">----------------------------------------</div>

      {/* === Item List === */}
      <div className="mb-2">
        {order.items.map((item) => (
          <div key={item.id} className="mb-1">
            <div className="flex justify-between">
              <span>{item.product.name}</span>
              <span>{formatRupiah(item.product.price * item.quantity)}</span>
            </div>
            <div className="text-[9px] text-gray-500">
              {item.quantity} × {formatRupiah(item.product.price)}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] font-semibold">----------------------------------------</div>

      {/* === Total Section === */}
      <div className="space-y-0.5 text-[10px] mb-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>PPN (11%)</span>
          <span>{formatRupiah(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-[11px]">
          <span>Total</span>
          <span>{formatRupiah(total)}</span>
        </div>
      </div>

      {/* === Payment Info === */}
      <div className="border-t border-gray-400 my-1 pt-1 text-[10px]">
        <div className="flex justify-between">
          <span>Metode</span>
          <span>{paymentMethod}</span>
        </div>
        {paymentMethod === "Cash" && (
          <>
            <div className="flex justify-between">
              <span>Uang Diterima</span>
              <span>{formatRupiah(cashGiven || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kembalian</span>
              <span>{formatRupiah(change || 0)}</span>
            </div>
          </>
        )}
      </div>

      <div className="text-[10px] font-semibold">========================================</div>

      {/* === Footer === */}
      <div className="text-center mt-2 text-[10px] leading-tight">
        <p>Terima Kasih Telah Berkunjung 💛</p>
        <p className="italic">Nikmati harimu bersama segelas Uhuyy</p>
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center mt-2">
        <QRCode
          value="https://kafehangat.id/feedback"
          size={60}
          style={{ height: "auto", maxWidth: "100%", width: "60px" }}
        />
        <p className="text-[9px] text-gray-500 mt-1">
          Scan untuk Pasword Wifi
        </p>
      </div>

      <div className="text-center mt-3 text-[9px]">
        <p>~ KopiUhuy ~</p>
      </div>
    </div>
  );
}
