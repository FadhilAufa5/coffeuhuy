import React, { ReactNode } from "react";
import { AppSidebar } from "@/layouts/app-sidebar ";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/* 🔹 Sidebar */}
      <AppSidebar />

      {/* 🔹 Main Section */}
      <SidebarInset className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        {/* ===== Top Header ===== */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200 md:hidden" />
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
              Dashboard Kasir
            </h1>
          </div>

          {/* Right section (user info or quick action) */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Admin
            </span>
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              alt="Admin Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* ===== Main Content ===== */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
