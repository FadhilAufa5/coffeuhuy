"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: "coffee" | "non-coffee" | "snack";
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Espresso",
    price: 20000,
    image: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXNwcmVzc298ZW58MHx8MHx8fDA%3D",
    category: "coffee",
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 25000,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
    category: "coffee",
  },
  {
    id: 3,
    name: "Latte",
    price: 22000,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
    category: "coffee",
  },
  {
    id: 4,
    name: "Americano",
    price: 18000,
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW1lcmljYW5vfGVufDB8fDB8fHww",
    category: "coffee",
  },
  {
    id: 5,
    name: "Thai Tea",
    price: 15000,
    image: "https://images.unsplash.com/photo-1644031995386-fe9665dc5b57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGhhaSUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D",
    category: "non-coffee",
  },
  {
    id: 6,
    name: "Matcha Latte",
    price: 20000,
    image: "https://images.unsplash.com/photo-1717603545758-88cc454db69b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hdGNoYXxlbnwwfHwwfHx8MA%3D%3D",
    category: "non-coffee",
  },
  {
    id: 7,
    name: "French Fries",
    price: 12000,
    image: "https://plus.unsplash.com/premium_photo-1672774750509-bc9ff226f3e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlY2glMjBmcmllc3xlbnwwfHwwfHx8MA%3D%3D",
    category: "snack",
  },
  {
    id: 8,
    name: "Donut",
    price: 10000,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9udXR8ZW58MHx8MHx8fDA%3D",
    category: "snack",
  },
];

export default function MenuCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: "start" });
  const [filter, setFilter] = React.useState<"all" | "coffee" | "non-coffee" | "snack">("all");

  const filteredProducts =
    filter === "all" ? mockProducts : mockProducts.filter((p) => p.category === filter);

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div className="flex justify-center gap-4">
        {["all", "coffee", "non-coffee", "snack"].map((cat) => (
          <Button
            key={cat}
            onClick={() => setFilter(cat as any)}
            variant={filter === cat ? "default" : "outline"}
            className="capitalize"
          >
            {cat === "all" ? "All" : cat.replace("-", " ")}
          </Button>
        ))}
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          <AnimatePresence mode="wait">
            {filteredProducts.map((product) => (
        <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-w-[250px] bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-5 flex flex-col"
            >
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
            />

            <div className="flex-1 flex flex-col justify-between">
                <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Rp {product.price.toLocaleString()}
                </p>
                </div>

                <Button className="w-full bg-red-500 hover:bg-red-700 text-white mt-auto">
                Lihat Detail
                </Button>
            </div>
            </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
