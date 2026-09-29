"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, PackagePlus, Tags } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/items/new", label: "Add Item", icon: PackagePlus },
  { href: "/categories", label: "Categories", icon: Tags },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />} size="lg">
              <Image src="/images/modus-logo.png" alt="" width={28} height={28} className="brand-mark" />
              <span className="brand-name">Modus</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const active = link.exact
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      render={<Link href={link.href} />}
                      isActive={active}
                      tooltip={link.label}
                    >
                      <link.icon aria-hidden="true" />
                      <span>{link.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-xs text-muted-foreground">
        Inventory management
      </SidebarFooter>
    </ShadcnSidebar>
  );
}