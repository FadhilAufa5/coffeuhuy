"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/ProductTable";

interface Props {
  products?: Product[];
  onView: (product: Product) => void;
}

export default function MenuCarousel({ products = [], onView }: Props) {
  const [filter, setFilter] = React.useState<
    "All" | Product["type"]
  >("All");

  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.type === filter);

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        {["All","Coffee","Non-Coffee","Snack","Pastry","Heavy Meal"].map((cat) => (
          <Button
            key={cat}
            onClick={() => setFilter(cat as any)}
            variant={filter === cat ? "default" : "outline"}
            className="capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Carousel Cards */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 py-4">
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-w-[220px] bg-white rounded-2xl shadow-lg p-4 flex flex-col"
                >
                  {product.image && (
                    <img
                      src={`/storage/${product.image}`}
                      alt={product.name}
                      className="w-full h-36 object-cover rounded-xl mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 mb-2">
                    Rp {product.price.toLocaleString()}
                  </p>
                  <Button
                    onClick={() => onView(product)}
                    className="mt-auto w-full bg-black text-white hover:bg-gray-700"
                  >
                    Lihat Detail
                  </Button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                Tidak ada produk untuk kategori ini.
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
