import { useState, useEffect } from "react"; // <-- Impor useEffect
import { Link, usePage, router } from "@inertiajs/react";
import { LogOut, LayoutGrid, HandCoins, House, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; 

export default function NavbarKasir() {
  const { url, props } = usePage();
  const user = props.auth?.user || { name: "Admin" };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard Kasir", href: "/adminkasir", icon: LayoutGrid },
    { name: "Kasir", href: "/kasir", icon: HandCoins },
    { name: "Uhuy", href: "/dashboard", icon: House },
  ];
  
  // [UPDATED] Fungsi logout sekarang menggunakan toast untuk konfirmasi
  const handleLogout = () => {
    toast("Are you sure you want to log out?", {
      description: "You will be returned to the login page.",
      action: {
        label: "Logout",
        onClick: () => {
          router.post('/logout', {}, {
            onSuccess: () => toast.success("You have been successfully logged out!"),
            onError: () => toast.error("Logout failed. Please try again.")
          });
        }
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // [NEW] Efek untuk mengunci scroll body saat menu mobile terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function untuk memastikan overflow di-reset jika komponen unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);


  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <img src="/logouhuy3.png" alt="Logo" className="w-24 h-12 rounded-md"/>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = url.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn("flex items-center gap-2 text-sm font-medium transition-colors", isActive ? "text-red-700 dark:text-red-400" : "text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400")}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/settings/profile"
              className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "A")}`} alt="Avatar" className="w-7 h-7 rounded-full"/>
              <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition" aria-label="Logout">
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Tombol Hamburger (Mobile) */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-600 dark:text-gray-300" aria-label="Buka menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Panel Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            // [UPDATED] Mengubah 'absolute' menjadi 'fixed' agar menempel di layar
            className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 z-40"
          >
            <nav className="flex flex-col p-4 space-y-2 h-full">
              {navItems.map((item) => {
                const isActive = url.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <motion.div variants={itemVariants} key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn("flex items-center gap-3 p-3 rounded-lg text-base font-medium", isActive ? "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800")}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Spacer untuk mendorong info user ke bawah */}
              <div className="flex-grow"></div>

              <motion.hr variants={itemVariants} className="my-2 border-gray-200 dark:border-gray-700" />

              {/* User Info & Logout (Mobile) */}
              <motion.div variants={itemVariants} className="flex items-center justify-between p-3">
                <Link
                  href="/settings/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "A")}`} alt="Avatar" className="w-8 h-8 rounded-full"/>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Logout">
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}