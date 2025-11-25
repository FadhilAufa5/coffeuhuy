import React, { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { ShoppingCart, Search, Box } from "lucide-react";
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
  const [buyerName, setBuyerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
    if (cart.length === 0 || !buyerName.trim()) {
      toast.error("Masukkan nama pembeli terlebih dahulu!");
      return;
    }

    const orderData = {
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      total: total,
      buyer_name: buyerName.trim(),
    };

    router.post("/kasir", orderData, {
      onStart: () => setIsProcessing(true),
      onFinish: () => setIsProcessing(false),
      onSuccess: () => {
        toast.success("✅ Pesanan berhasil dibuat!");
        setCart([]);
        setBuyerName("");
        setShowCart(false);
      },
      onError: (errors) => {
        console.error(errors);
        toast.error("Terjadi kesalahan. Cek console untuk detail.");
      },
    });
  };

  const categories = ["All", "Coffee", "Non-Coffee", "Snack", "Pastry", "Heavy Meal"];

  const productsToDisplay = products.filter((p) => {
    const matchCategory = activeCategory === "All" || p.type === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <NavbarKasir />
      <Toaster position="top-right" />

      <div className="flex flex-1 overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Point of Sales Kopi Uhuyy
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Pilih produk untuk ditambahkan ke pesanan anda dan selesaikan pembayaran.
                </p>
              </div>

              {/* Mobile Cart Button */}
              {cart.length > 0 && (
                <button
                  onClick={() => setShowCart(true)}
                  className="lg:hidden relative bg-red-800 text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-semibold">{cart.length}</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-red-800 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {productsToDisplay.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-400">
           
                <div className="text-6xl mb-3"> <Box className="w-14 h-14"/> </div>
                <p className="text-lg font-medium">Tidak ada produk ditemukan</p>
                <p className="text-sm">Coba ubah kategori atau kata kunci pencarian</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {productsToDisplay.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-red-200 dark:hover:border-red-900 transition-all duration-300 group cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 min-h-[2rem]">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-red-800 dark:text-red-400 font-bold text-base">
                          {formatRupiah(product.price)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="bg-red-800 hover:bg-red-700 text-white w-9 h-9 rounded-lg transition-colors flex items-center justify-center shadow-md group-hover:scale-110"
                        >
                          <span className="text-lg leading-none">+</span>
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
              buyerName={buyerName}
              setBuyerName={setBuyerName}
            />
          </div>
        )}
      </div>

      {/* Mobile Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden flex justify-end animate-in fade-in duration-200">
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
            buyerName={buyerName}
            setBuyerName={setBuyerName}
          />
        </div>
      )}
    </div>
  );
}
