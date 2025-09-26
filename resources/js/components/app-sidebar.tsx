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
  BookOpen,
  Folder,
  LayoutGrid,
  ShoppingCart,
  Gift,
  MapPin,
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

const footerNavItems: NavItem[] = [
  // {
  //   title: 'Repository',
  //   href: 'https://github.com/laravel/react-starter-kit',
  //   icon: Folder,
  // },
  // {
  //   title: 'Documentation',
  //   href: 'https://laravel.com/docs/starter-kits#react',
  //   icon: BookOpen,
  // },
];

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
        {/* Dashboard menu */}
        <NavMain items={dashboardNavItems} />

        {/* Menus group */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>Menus</SidebarMenuButton>
          </SidebarMenuItem>
          <NavMain items={menuNavItems} />
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
