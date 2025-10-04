import React, { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaymentMethodProps {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  order: {
    id: string;
    product: {
      name: string;
      variant: string;
      image: string;
      price: number;
    };
    discount: number;
  };
}

export default function PaymentMethod({ customer, order }: PaymentMethodProps) {
  const [method, setMethod] = useState("gopay");

  const total = order.product.price - order.discount;

  const ewallets = [
    { id: "dana", name: "DANA", logo: "/icons/dana.png" },
    { id: "gopay", name: "GoPay", logo: "/icons/gopay.png" },
    { id: "shopeepay", name: "ShopeePay", logo: "/icons/shopeepay.png" },
    { id: "truemoney", name: "TrueMoney", logo: "/icons/truemoney.png" },
    { id: "astrapay", name: "AstraPay", logo: "/icons/astrapay.png" },
  ];

  const banks = [
    { id: "superbank", name: "Superbank", logo: "/icons/superbank.png" },
    { id: "jenius", name: "Jenius", logo: "/icons/jenius.png" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>

          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-500">Holder</label>
                <input
                  className="w-full border rounded-xl px-4 py-2"
                  value={customer.name}
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  className="w-full border rounded-xl px-4 py-2"
                  value={customer.email}
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone number</label>
                <input
                  className="w-full border rounded-xl px-4 py-2"
                  value={customer.phone}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="text-center py-6 bg-gray-100 rounded-2xl">
            <p className="text-gray-600 mb-1">Your total payment</p>
            <p className="text-4xl font-bold text-gray-800">
              {formatRupiah(total)}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Pay before March 13, at 10.25 PM
            </p>
          </div>

          {/* Select Method */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Select Method</h3>

            <div className="space-y-4">
              {/* E-Wallet */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">E-Wallet</h4>
                <div className="flex flex-wrap gap-4">
                  {ewallets.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setMethod(item.id)}
                      className={`flex items-center justify-center w-28 h-14 border rounded-xl transition ${
                        method === item.id
                          ? "border-blue-600 shadow-lg"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img src={item.logo} alt={item.name} className="h-6" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Transfer */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Bank Transfer</h4>
                <div className="flex flex-wrap gap-4">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setMethod(bank.id)}
                      className={`flex items-center justify-center w-28 h-14 border rounded-xl transition ${
                        method === bank.id
                          ? "border-blue-600 shadow-lg"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img src={bank.logo} alt={bank.name} className="h-6" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-2">Order ID</p>
            <p className="font-semibold mb-4">ID-GadgetPay-{order.id}</p>

            <div className="flex items-center gap-4 border p-3 rounded-xl">
              <img
                src={order.product.image}
                alt={order.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold">{order.product.name}</p>
                <p className="text-gray-500 text-sm">{order.product.variant}</p>
              </div>
              <span className="ml-auto font-semibold text-gray-700">
                {formatRupiah(order.product.price)}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>{order.product.name}</span>
                <span>{formatRupiah(order.product.price)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Discount</span>
                <span>-{formatRupiah(order.discount)}</span>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold text-lg">
                <span>Total</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold">
            Pay now
          </Button>
        </div>
      </div>
    </div>
  );
}
