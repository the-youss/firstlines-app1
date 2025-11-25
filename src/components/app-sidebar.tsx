'use client'
import { appConfig } from "@/app-config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, Megaphone, MessageSquare, Settings, Users } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { User } from "./user";
import { appRoutes } from "@/app-routes";

const menuItems = [
  { title: "Dashboard", url: appRoutes.appDashboard, icon: Home },
  { title: "Inbox", url: appRoutes.appInbox, icon: MessageSquare, unreadCount: 2 },
  { title: "Leads", url: appRoutes.appLeads, icon: Users },
  { title: "Campaigns", url: appRoutes.appCampaigns, icon: Megaphone },
  { title: "Profile", url: appRoutes.appProfile, icon: Settings },
];




export function AppSidebar() {
  const { state } = useSidebar();
  const currentPath = usePathname();

  const isActive = (path: string) => currentPath === path

  return (
    <SidebarComponent>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href={appRoutes.appDashboard} className="flex items-center gap-2">
          <Logo />
          {state !== "collapsed" && <span className="text-lg font-semibold">{appConfig.appTitle}</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.unreadCount && item.unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                          {item.unreadCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <User />
      </SidebarFooter>
    </SidebarComponent>
  );
}
