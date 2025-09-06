import { Head } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/AboutUs";
import EventPage from "@/components/EventPage";
import MenuCarousel from "@/components/MenuCarousel";
import Outlets from "@/components/Outlets";
import Reviews from "@/components/Reviews";

export default function Welcome() {
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
        <MenuCarousel />
      </section>

      {/* Event Section */}
   
      <Outlets />
        <EventPage />
      <Reviews />

      <Footer />
    </div>
  );
}
