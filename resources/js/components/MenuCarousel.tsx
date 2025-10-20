"use client";

import * as React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/ProductTable";

interface Props {
  products?: Product[];
  onView: (product: Product) => void;
}

// ==== Animasi Container & Card ====
const carouselContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, duration: 0.3 },
  },
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.4 },
  },
  exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
};

export default function MenuCarousel({ products = [], onView }: Props) {
  const [filter, setFilter] = React.useState<"All" | Product["type"]>("All");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.type === filter);

  // ==== Drag Scroll Support (untuk desktop) ====
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.classList.add("cursor-grabbing");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2; // kecepatan drag
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="space-y-4 w-full select-none">
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

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-6 scroll-smooth cursor-grab"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hilangkan scrollbar */}
        <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={filter}
            variants={carouselContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-4 px-4"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  variants={cardVariants}
                  exit="exit"
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    boxShadow:
                      "0px 15px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04)",
                  }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="min-w-[180px] max-w-[180px] bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 flex flex-col h-[290px] cursor-pointer"
                  onClick={() => onView(product)}
                >
                  {/* Gambar */}
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

                  {/* Info Produk */}
                  <div className="flex flex-col flex-grow pointer-events-none">
                    <h3 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-100 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Tombol */}
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
