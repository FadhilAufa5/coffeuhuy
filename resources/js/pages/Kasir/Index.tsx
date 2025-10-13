import React, { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import Cart from "@/components/Cart";
import NavbarKasir from "@/components/NavbarKasir";
import { formatRupiah } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function KasirIndex({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.success(`+1 ${product.name}`);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.name} ditambahkan ke pesanan`);
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const updateQuantity = (productId: number, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => {
          if (item.quantity <= 0) {
            toast(`❌ ${item.name} dihapus dari order`);
            return false;
          }
          return true;
        })
    );
  };

  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.11;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  const handlePayment = () => {
    if (cart.length === 0) return;

    const orderData = {
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      total: total,
      payment_method: paymentMethod,
    };

    router.post("/kasir", orderData, {
      onStart: () => setIsProcessing(true),
      onFinish: () => setIsProcessing(false),
      onSuccess: () => {
        toast.success("✅ Pesanan berhasil dibuat!");
        setCart([]);
        setShowCart(false);
      },
      onError: (errors) => {
        console.error(errors);
        toast.error("Terjadi kesalahan. Cek console untuk detail.");
      },
    });
  };

  const categories = ["All", "Coffee", "Non-Coffee", "Snack", "Pastry", "Heavy Meal"];

  const productsToDisplay = products.filter(
    (p) => activeCategory === "All" || p.type === activeCategory
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* 🔺 Navbar Kasir */}
      <NavbarKasir />

      <Toaster position="top-right" />

      <div className="flex flex-1 overflow-hidden">
        {/* 🧾 Daftar Produk */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                POS CoffeeUhuy ☕
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Pilih produk dan tambahkan ke pesanan.
              </p>
            </div>

            {/* Tombol Cart untuk mobile */}
            {cart.length > 0 && (
              <button
                onClick={() => setShowCart(true)}
                className="lg:hidden relative bg-red-800 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
              >
                Cart
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              </button>
            )}
          </div>

          {/* 🧩 Kategori */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-red-800 text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 🧱 Produk Grid */}
          {productsToDisplay.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              Tidak ada produk di kategori ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {productsToDisplay.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col border rounded-xl bg-white dark:bg-gray-900 overflow-hidden shadow hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-red-800 font-bold text-sm">
                        {formatRupiah(product.price)}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-red-800 text-white px-3 py-1 rounded-lg hover:bg-red-700 shadow-sm transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 💳 Cart Desktop */}
        {cart.length > 0 && (
          <div className="hidden lg:flex">
            <Cart
              cart={cart}
              subtotal={subtotal}
              tax={tax}
              total={total}
              isProcessing={isProcessing}
              updateQuantity={updateQuantity}
              handlePayment={handlePayment}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>
        )}
      </div>

      {/* 🧾 Drawer Cart Mobile */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex lg:hidden">
          <Cart
            cart={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            isProcessing={isProcessing}
            updateQuantity={updateQuantity}
            handlePayment={handlePayment}
            onClose={() => setShowCart(false)}
            isMobile
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
      )}
    </div>
  );
}
