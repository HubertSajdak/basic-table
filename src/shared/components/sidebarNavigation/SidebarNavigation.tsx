import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/shadcn/components/sidebar';
import { useState } from 'react';
import { navigationItems } from './sidebarNavigation.config';
import { Typography } from '../typography/Typography';
import { Link, matchPath, useLocation } from 'react-router';

export const SidebarNavigation = () => {
  const [open, setOpen] = useState(true);
  const { pathname } = useLocation();
  return (
    <SidebarProvider open={open} onOpenChange={setOpen} className="w-1xs">
      <ShadcnSidebar collapsible="icon" className="bg-surface-page p-1 group-data-[side=left]:border-r-0">
        <SidebarHeader className="flex justify-end w-full">
          <SidebarTrigger className="text-sidebar-icon" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="p-1">
            {navigationItems.map((item) => {
              const isNavigationItemActive = matchPath({ path: item.path, end: false }, pathname) !== null;
              return (
                <SidebarMenuItem key={item.title} className="mb-1 flex text-sidebar-content">
                  <SidebarMenuButton
                    render={<Link to={item.path} />}
                    isActive={isNavigationItemActive}
                    // Transparent border when inactive keeps the size identical in both states
                    className="rounded-lg group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1! data-active:bg-surface-raised data-active:shadow-sm [&_svg]:text-sidebar-icon data-active:text-sidebar-content-active data-active:[&_svg]:text-sidebar-content-active"
                  >
                    {item.icon}
                    <Typography
                      variant="body1"
                      className={`text-lg font-light ${isNavigationItemActive && 'font-medium'}`}
                    >
                      {item.title}
                    </Typography>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </ShadcnSidebar>
    </SidebarProvider>
  );
};
