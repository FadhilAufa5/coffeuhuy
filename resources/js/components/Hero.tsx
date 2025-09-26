import { motion } from "framer-motion";
import { Coffee, MapPin } from "lucide-react";

export default function Hero() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative h-[90vh] flex items-center justify-center overflow-hidden 
      bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gray-200/20 blur-3xl dark:bg-gray-700/20" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-gray-300/20 blur-3xl dark:bg-gray-600/20" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left space-y-6"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Coffeeshop
              <span className="block text-gray-600 dark:text-gray-300">Uhuy</span>
            </h1>
            
            <div className="w-20 h-1 bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-500 mx-auto lg:mx-0 rounded-full"></div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Tempat nongkrong asik dengan kopi nikmat, makanan ringan, dan suasana
            hangat yang bikin betah berlama-lama.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => handleScroll("menu")}
              className="px-8 py-3 flex items-center gap-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-600 text-white font-semibold shadow-lg hover:from-black hover:to-gray-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 dark:from-gray-200 dark:to-gray-400 dark:text-gray-900 dark:hover:from-white dark:hover:to-gray-300"
            >
              <Coffee className="w-5 h-5" />
              Explore Menu
            </button>

            <button
              onClick={() => handleScroll("locations")}
              className="px-8 py-3 flex items-center gap-3 rounded-lg border-2 border-gray-700 text-gray-700 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-600 hover:text-white hover:border-transparent font-semibold transition-all duration-200 dark:border-gray-300 dark:text-gray-300 dark:hover:from-gray-200 dark:hover:to-gray-400 dark:hover:text-gray-900"
            >
              <MapPin className="w-5 h-5" />
              Find Outlet
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
              <div>Happy Customers</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">15+</div>
              <div>Coffee Varieties</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">5+</div>
              <div>Outlets</div>
            </div>
          </div>
        </motion.div>

        {/* Visual element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative">
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src="/logouhuy.png" 
                alt="CoffeeShop Logo"
                className="w-124 h-90 object-cover rounded-full "
              />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-500 opacity-80"></div>
            <div className="absolute -bottom-6 -left-6 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 opacity-60"></div>
            <div className="absolute top-1/4 -left-8 w-4 h-4 rounded-full bg-gray-500 dark:bg-gray-400 opacity-70"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
