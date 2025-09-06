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
    <header className="sticky top-0 z-50 w-full bg-[#FDFDFC]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => handleScroll("home")}
          className="cursor-pointer flex items-center gap-2"
        >
          <img
            src="/kopi.png" // 
            alt="CoffeeShop Uhuy"
            className="h-14 w-auto max-h-14"
          />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => handleScroll("home")} className="hover:underline">
            Home
          </button>
          <button onClick={() => handleScroll("menu")} className="hover:underline">
            Menu
          </button>
          <button onClick={() => handleScroll("about")} className="hover:underline">
            About
          </button>
          <button onClick={() => handleScroll("locations")} className="hover:underline">
            Outlet
          </button>

          {auth.user ? (
            <Link
              href={dashboard()}
              className="px-5 py-1.5 rounded-sm border text-sm hover:border-gray-400 dark:border-gray-600"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href={login()} className="px-5 py-1.5 text-sm hover:underline">
                Log in
              </Link>
              <Link
                href={register()}
                className="px-5 py-1.5 rounded-sm border text-sm hover:border-gray-400 dark:border-gray-600"
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
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#FDFDFC] dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3">
          <button onClick={() => handleScroll("home")}>Home</button>
          <button onClick={() => handleScroll("menu")}>Menu</button>
          <button onClick={() => handleScroll("about")}>About</button>
          <button onClick={() => handleScroll("locations")}>Outlet</button>

          {auth.user ? (
            <Link href={dashboard()} onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href={login()} onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link href={register()} onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
