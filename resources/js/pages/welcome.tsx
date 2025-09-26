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
import CurvedLoop from '@/components/CurvedLoop';
import Masonry from '@/components/Masonry';
import { X } from "lucide-react";

// Definisikan tipe untuk item Masonry agar lebih jelas
interface MasonryItem {
  id: string;
  img: string;
  url: string;
  height: number;
}

// 1. Nama komponen diubah menjadi "Welcome" (diawali huruf kapital)
export default function Welcome({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 2. Data untuk Masonry didefinisikan di dalam komponen, sebelum return
  const masonryItems: MasonryItem[] = [
    { id: "1", img: "https://images.unsplash.com/photo-1511920183353-32a5d5d57faf?q=80&w=800", url: "#", height: 400 },
    { id: "2", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800", url: "#", height: 250 },
    { id: "3", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800", url: "#", height: 600 },
    { id: "4", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800", url: "#", height: 450 },
    { id: "5", img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800", url: "#", height: 300 },
    { id: "6", img: "https://images.unsplash.com/photo-1495474472287-4d713b20e24b?q=80&w=800", url: "#", height: 550 },
  ];

  return (
    <div className="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] font-sans antialiased">
      <Head title="CoffeeShop Uhuy" />
      <Navbar />
      <main>
        <Hero />
        <CurvedLoop marqueeText="Tentang CoffeUhuy ✦" />
        <About />

        {/* Bagian Menu */}
        <section id="menu" className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Menu Andalan Kami</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Pilih kategori, geser untuk melihat semua pilihan — kopi, minuman non-kopi, dan camilan lezat kami.
          </p>
          <MenuCarousel
            products={products}
            onView={(product) => setSelectedProduct(product)}
          />
        </section>

        <Outlets />
        <EventPage />
        
        <Reviews />
      <Footer />
    
   
         
      </main>
       
      

      {/* Modal Detail Produk dengan dukungan Dark Mode */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="p-6 max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              {selectedProduct.image && (
                <img
                  src={`/storage/${selectedProduct.image}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  alt={selectedProduct.name}
                />
              )}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProduct.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{selectedProduct.description}</p>
              <span className="inline-block bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs font-semibold mt-3 px-2.5 py-1 rounded-full">
                {selectedProduct.type}
              </span>
              <p className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-100">
                Rp {selectedProduct.price.toLocaleString('id-ID')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        
      
    </div>
    
  );

 

}