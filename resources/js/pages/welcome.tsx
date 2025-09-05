import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Espresso', price: 20000, image: '/images/espresso.jpg' },
  { id: 2, name: 'Cappuccino', price: 25000, image: '/images/cappuccino.jpg' },
  { id: 3, name: 'Latte', price: 22000, image: '/images/latte.jpg' },
  { id: 4, name: 'Americano', price: 18000, image: '/images/americano.jpg' },
];

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false); // tutup menu mobile jika dibuka
    }
  };

  return (
    <div className="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] font-sans">
      <Head title="CoffeeShop" />

      {/* Navbar */}
      <header className="w-full max-w-6xl mx-auto p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => handleScroll('home')}>CoffeeShop</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-4">
          <button className="hover:underline" onClick={() => handleScroll('home')}>Home</button>
          <button className="hover:underline" onClick={() => handleScroll('menu')}>Menu</button>
          <button className="hover:underline" onClick={() => handleScroll('about')}>About</button>
          <button className="hover:underline" onClick={() => handleScroll('location')}>Location</button>

          {auth.user ? (
            <Link
              href={dashboard()}
              className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={login()}
                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
              >
                Log in
              </Link>
              <Link
                href={register()}
                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#FDFDFC] dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-2">
          <button className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-left" onClick={() => handleScroll('home')}>Home</button>
          <button className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-left" onClick={() => handleScroll('menu')}>Menu</button>
          <button className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-left" onClick={() => handleScroll('about')}>About</button>
          <button className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-left" onClick={() => handleScroll('location')}>Location</button>

          {auth.user ? (
            <Link
              href={dashboard()}
              className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={login()}
                className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href={register()}
                className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      )}

      {/* Hero Section */}
      <section id="home" className="text-center py-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Welcome to CoffeeShop
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover the finest coffee crafted with passion. Taste the elegance in every cup.
        </p>
        <button
          onClick={() => handleScroll('menu')}
          className="bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Explore Menu
        </button>
      </section>

      {/* Product Menu */}
      <section id="menu" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-[#1b1b18] rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded mb-4"
              />
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="mb-4">Rp {product.price.toLocaleString()}</p>
              <button className="bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] px-4 py-2 rounded hover:opacity-90 transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gray-100 dark:bg-[#111]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            CoffeeShop is a premium coffee brand that has been serving quality coffee for years.
            We select the best beans and roast them to perfection, ensuring every cup is a moment
            of joy. Visit us and experience the elegance of coffee culture.
          </p>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Location</h2>
        <div className="flex justify-center">
          <iframe
            title="CoffeeShop Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.123456!2d112.752!3d-7.257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7xxxxxxx%3A0x123456789!2sCoffeeShop!5e0!3m2!1sen!2sid!4v1693890000000!5m2!1sen!2sid"
            className="w-full h-96 rounded-lg border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-20">
        &copy; {new Date().getFullYear()} CoffeeShop. All rights reserved.
      </footer>
    </div>
  );
}
