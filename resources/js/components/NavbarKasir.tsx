import { Link, usePage, router } from "@inertiajs/react";
import { LogOut, LayoutGrid, HandCoins, House } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NavbarKasir() {
  const { url, props } = usePage();
  const user = props.auth?.user || { name: "Admin" };

  const navItems = [
    { name: "Dashboard Kasir", href: "/adminkasir", icon: LayoutGrid },
    { name: "Kasir", href: "/kasir", icon: HandCoins },
    { name: "Uhuy", href: "/dashboard", icon: House },
  ];

  const handleLogout = () => {
    router.post(route("logout"), {}, {
      onSuccess: () => {
     
        console.log("Berhasil logout");
      },
      onError: (err) => {
        console.error("Logout gagal", err);
      },
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* 🔹 Logo & App Name */}
        <div className="flex items-center gap-3">
          <img
            src="/logouhuy3.png"
            alt="Logo"
            className="w-24 h-12 rounded-md dark:border-gray-700"
          />
        </div>

        {/* 🔹 Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = url.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-red-700 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 🔹 User & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || "Admin"
              )}`}
              alt="Admin Avatar"
              className="w-7 h-7 rounded-full"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
              {user.name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
