import { Head } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/AboutUs";
import EventPage from "@/components/EventPage";
import MenuCarousel from "@/components/MenuCarousel";
import Outlets from "@/components/Outlets";
import Reviews from "@/components/Reviews";
import { Product } from "@/components/ProductTable";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  products: Product[];
}

export default function welcome({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] font-sans antialiased">
      <Head title="CoffeeShop" />

      <Navbar />
      <Hero />
      <About />

      {/* Menu Section */}
      <section id="menu" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Menu</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Pilih kategori, geser untuk melihat semua pilihan — kopi, minuman non
          kopi, dan snack lezat kami.
        </p>
        <MenuCarousel
          products={products}
          onView={(product) => setSelectedProduct(product)}
        />
      </section>

      {/* Modal Detail Produk */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="p-6 max-w-sm w-full bg-white rounded shadow-xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-2 right-2"
              >
                ✕
              </button>
              {selectedProduct.image && (
                <img
                  src={`/storage/${selectedProduct.image}`}
                  className="w-full h-40 object-cover rounded mb-4"
                  alt={selectedProduct.name}
                />
              )}
              <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
              <p className="text-gray-500">{selectedProduct.description}</p>
              <p className="text-sm mt-1">Jenis: {selectedProduct.type}</p>
              <p className="text-lg font-semibold mt-2">
                Rp {selectedProduct.price.toLocaleString()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Outlets />
      <EventPage />
      <Reviews />
      <Footer />
    </div>
  );
}
