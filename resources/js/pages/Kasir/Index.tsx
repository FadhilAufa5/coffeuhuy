// resources/js/Pages/Kasir/Index.tsx
import React, { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import Cart from "@/components/Cart";
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

  // ➕ Tambah produk ke cart
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
      toast.success(`${product.name} ditambahkan ke order`);
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  // 🔄 Update jumlah item
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

  // 💰 Hitung subtotal, pajak (11%), total
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.11;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  // 🧾 Submit order
  const handlePayment = () => {
    if (cart.length === 0) return;

    const orderData = {
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      total: total,
    };

    router.post("/kasir", orderData, {
      onStart: () => setIsProcessing(true),
      onFinish: () => setIsProcessing(false),
      onSuccess: () => {
        toast.success("Pesanan berhasil dibuat!");
        setCart([]);
        setShowCart(false);
      },
      onError: (errors) => {
        console.error(errors);
        toast.error("Terjadi kesalahan. Cek console untuk detail.");
      },
    });
  };

  // 📂 Kategori produk
  const categories = [
    "All",
    "Coffee",
    "Non-Coffee",
    "Snack",
    "Pastry",
    "Heavy Meal",
  ];

  const productsToDisplay = products.filter(
    (p) => activeCategory === "All" || p.type === activeCategory
  );

  return (
    <div className="flex h-screen relative bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      {/* LEFT: Product list */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">POS CoffeeUhuy</h1>
            <p className="text-gray-500">
              Pilih produk untuk ditambahkan ke pesanan
            </p>
          </div>

          {/* Cart Button (mobile) */}
          {cart.length > 0 && (
            <button
              onClick={() => setShowCart(true)}
              className="lg:hidden relative bg-orange-500 text-white px-4 py-2 rounded shadow"
            >
              Cart
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 py-1 rounded-full">
                {cart.length}
              </span>
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-red-800 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productsToDisplay.map((product) => (
            <div
              key={product.id}
              className="flex flex-col border rounded-lg bg-white overflow-hidden shadow hover:shadow-lg transition h-full"
            >
              {/* Gambar */}
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover"
              />

              {/* Konten */}
              <div className="p-3 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-red-600 font-bold text-sm">
                    {formatRupiah(product.price)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-red-800 text-white px-3 py-1 rounded shadow hover:bg-red-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Desktop */}
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
          />
        </div>
      )}

      {/* Cart Drawer Mobile */}
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
          />
        </div>
      )}
    </div>
  );
}
