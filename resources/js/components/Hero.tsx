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
      bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      {/* Decorative gradient circle */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-xl">
            Coffeeshop Uhuy
          </h1>
          <p className="text-gray-300 mt-6 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
            Tempat nongkrong asik dengan kopi nikmat, makanan ringan, dan suasana
            hangat yang bikin betah berlama-lama.
          </p>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <button
              onClick={() => handleScroll("menu")}
              className="px-6 py-3 flex items-center gap-2 rounded-lg bg-white text-neutral-900 font-semibold shadow hover:shadow-md transition"
            >
              <Coffee className="w-5 h-5" />
              Explore Menu
            </button>

            <button
              onClick={() => handleScroll("locations")}
              className="px-6 py-3 flex items-center gap-2 rounded-lg border border-gray-300 text-white hover:bg-white/10 transition"
            >
              <MapPin className="w-5 h-5" />
              Find Outlet
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
