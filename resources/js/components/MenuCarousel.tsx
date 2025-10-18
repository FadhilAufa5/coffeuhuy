"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/ProductTable"; // Pastikan path ini benar

interface Props {
  products?: Product[];
  onView: (product: Product) => void;
}

// 1. Definisikan Variants untuk animasi container dan item
const carouselContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Menerapkan delay sebelum anak-anaknya mulai beranimasi
      staggerChildren: 0.08, // Jeda antar setiap kartu
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
  },
};

export default function MenuCarousel({ products = [], onView }: Props) {
  const [filter, setFilter] = React.useState<"All" | Product["type"]>("All");

  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.type === filter);

  return (
    <div className="space-y-4 w-full">
      {/* Tombol Filter */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap px-4">
        {["All", "Coffee", "Non-Coffee", "Snack", "Pastry", "Heavy Meal"].map(
          (cat) => (
            <motion.div key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setFilter(cat as any)}
                variant={filter === cat ? "default" : "outline"}
                className="capitalize h-9 px-4 text-sm"
              >
                {cat}
              </Button>
            </motion.div>
          )
        )}
      </div>

      {/* Kontainer Carousel dengan Scroll Tersembunyi */}
      <div
        className="overflow-x-auto pb-6" // Beri sedikit padding bawah agar shadow terlihat
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
        
        {/* AnimatePresence menangani animasi masuk dan keluar dari item */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={filter} // Key diubah berdasarkan filter agar container di-render ulang & animasi stagger berjalan
            variants={carouselContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-4 px-4"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout // 2. Ini adalah kunci untuk animasi layout yang mulus
                  variants={cardVariants}
                  exit="exit"
                  // 3. Efek interaktif saat hover dan tap
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    boxShadow: "0px 15px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="min-w-[180px] max-w-[180px] bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 flex flex-col h-[290px] cursor-pointer"
                  onClick={() => onView(product)} // Klik di mana saja pada kartu
                >
                  {/* Wrapper Gambar */}
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-2 pointer-events-none">
                    {product.image ? (
                      <img
                        src={`/storage/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs">
                        No Image
                      </span>
                    )}
                  </div>

                  {/* Konten */}
                  <div className="flex flex-col flex-grow pointer-events-none">
                    <h3 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-100 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  
                  {/* Tombol diganti menjadi indikator visual, karena seluruh kartu bisa diklik */}
                  <div className="mt-auto pt-2">
                    <div className="w-full h-9 flex items-center justify-center text-sm bg-black text-white dark:bg-white dark:text-black rounded-md font-medium">
                      Lihat Detail
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="w-full text-center py-10"
              >
                <p className="text-gray-500 dark:text-gray-400">
                  Tidak ada produk untuk kategori ini.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}