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
import DomeGallery from '@/components/DomeGallery';
import ScrollToTopButton from '@/components/ScrollTopButton';


interface MasonryItem {
  id: string;
  img: string; 
  url: string;
  height: number;
}

interface Event {
  id: number;
  name: string;
  date: string;
  description: string;
  image: string;
}


export default function Welcome({ auth, products, events }: { auth: any; products: Product[]; events: Event[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] font-sans antialiased overflow-x-hidden">
      <Head title="CoffeeUhuy" />
      <Navbar />
      
      <main className="relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
        </motion.div>

        {/* Curved Loop Divider */}
        <CurvedLoop marqueeText="Tentang CoffeeUhuy ✦" />

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <About />
        </motion.div>

        {/* Menu Section - Enhanced Responsive */}
        <section id="menu" className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400 bg-clip-text text-transparent">
                Menu Andalan Kami
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Pilih kategori, geser untuk melihat semua pilihan — kopi, minuman non-kopi, dan camilan lezat kami.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MenuCarousel
                products={products}
                onView={(product) => setSelectedProduct(product)}
              />
            </motion.div>
          </div>
        </section>

        {/* Outlets Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Outlets />
        </motion.div>

        {/* Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <EventPage events={events} />
        </motion.div>

        {/* Gallery Section - Enhanced Responsive */}
        <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Gallery Sobat Uhuy
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Intip momen seru dan kehangatan di Coffee Uhuy melalui galeri foto kami.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen"
          >
            <DomeGallery />
          </motion.div>
        </section>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Reviews />
        </motion.div>

        {/* Footer */}
        <Footer />
        
        {/* Scroll to Top Button */}
        <ScrollToTopButton />
      </main>
       
      

      {/* Modal Detail Produk - Enhanced Responsive Design */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg hover:scale-110"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Product Image */}
              {selectedProduct.image && (
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                  <motion.img
                    src={`/storage/${selectedProduct.image}`}
                    className="w-full h-full object-cover"
                    alt={selectedProduct.name}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              {/* Product Details */}
              <div className="p-5 sm:p-6 md:p-8">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <span className="flex-shrink-0 inline-flex items-center bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-md">
                    {selectedProduct.type}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {selectedProduct.description || "Nikmati cita rasa istimewa dari menu pilihan kami."}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Harga
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400 bg-clip-text text-transparent">
                      Rp {selectedProduct.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        
      
    </div>
    
  );

 

}