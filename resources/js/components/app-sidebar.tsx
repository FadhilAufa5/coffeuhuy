import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
  LayoutGrid,
  ShoppingCart,
  Gift,
  MapPin,
  HandCoins

} from 'lucide-react';
import AppLogo from './app-logo';

const dashboardNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
  },
];

const menuNavItems: NavItem[] = [
  {
    title: 'Products',
    href: '/products',
    icon: ShoppingCart,
  },
  {
    title: 'Events',
    href: '/events',
    icon: Gift,
  },
  {
    title: 'Outlets',
    href: '/outlets',
    icon: MapPin,
  },

];
const cashierNavItems: NavItem[] = [

  {
    title: 'Dashboard Kasir',
    href: '/adminkasir',
    icon: LayoutGrid,
  },
  {
    title: 'Kasir',
    href: '/kasir',
    icon: HandCoins,
  },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Group: Platform */}
        <NavMain items={dashboardNavItems} label="Platform" />

        {/* Group: Menus */}
        <NavMain items={menuNavItems} label="Menus" />
        {/* Group: Menus */}
        <NavMain items={cashierNavItems} label="Cashier Menus" />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
