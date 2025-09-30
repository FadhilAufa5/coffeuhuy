// src/components/Navbar.tsx
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { dashboard, login, register } from "@/routes";
import { type SharedData } from "@/types";

export default function Navbar() {
  const { auth } = usePage<SharedData>().props;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => handleScroll("home")}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="/logouhuy3.png"
                alt="CoffeeShop Uhuy"
                className="h-22 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:block">
              {/* <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                CoffeeShop Uhuy
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Premium Coffee
              </p> */}
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { label: "Home", id: "home" },
              { label: "Menu", id: "menu" },
              { label: "About", id: "about" },
              { label: "Outlet", id: "locations" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 group"
              >
                {item.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-700 dark:bg-gray-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
              </button>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {auth.user ? (
              <Link
                href={dashboard()}
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-md hover:from-black hover:to-gray-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Dashboard
              </Link>
            ) : (
              <>
                {/* <Link
                  href={login()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                >
                  Log in
                </Link> */}
                <Link
                  href={login()}
                  className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-md hover:from-black hover:to-gray-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Login Mitra
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                  menuOpen ? "opacity-0 rotate-45" : "opacity-100 rotate-0"
                }`}
              />
              <X
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                  menuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-45"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-sm border-t border-gray-200/20 dark:border-gray-700/30 px-4 pb-4">
          <div className="flex flex-col space-y-1 pt-2">
            {[
              { label: "Home", id: "home" },
              { label: "Menu", id: "menu" },
              { label: "About", id: "about" },
              { label: "Outlet", id: "locations" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="text-left px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-2">
            {auth.user ? (
              <Link
                href={dashboard()}
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg hover:from-black hover:to-gray-700 transition-all duration-200 shadow-md"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={login()}
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  Log in
                </Link>
                <Link
                  href={register()}
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg hover:from-black hover:to-gray-700 transition-all duration-200 shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
