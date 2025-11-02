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
      <NavbarKasir />
      <Toaster position="top-right" />

      <div className="flex flex-1 overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 bg-white border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ☕ Kopi Uhuy POS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pilih produk untuk ditambahkan ke pesanan
                </p>
              </div>

              {/* Mobile Cart Button */}
              {cart.length > 0 && (
                <button
                  onClick={() => setShowCart(true)}
                  className="lg:hidden relative bg-red-800 text-white px-4 py-2.5 rounded-lg shadow-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  <span>🛒</span>
                  <span className="font-semibold">{cart.length}</span>
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex-shrink-0 px-6 py-3 bg-white border-b overflow-x-auto">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeCategory === cat
                      ? "bg-red-800 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {productsToDisplay.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-400">
                <div className="text-6xl mb-3">📦</div>
                <p>Tidak ada produk di kategori ini</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {productsToDisplay.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition group"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>

                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-red-800 font-bold text-sm">
                          {formatRupiah(product.price)}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-red-800 text-white w-8 h-8 rounded-lg hover:bg-red-700 transition flex items-center justify-center shadow"
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
        </div>

        {/* Desktop Cart Sidebar */}
        {cart.length > 0 && (
          <div className="hidden lg:block">
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

      {/* Mobile Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 z-50 lg:hidden flex justify-end">
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
