'use client'
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AlertCircle, Bell, CheckCircle, Linkedin, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import { LinkedInSessionStatus } from "../linkedin-session-status";

interface AppLayoutProps {
  children: ReactNode;
}

const mockNotifications = [
  {
    id: 1,
    type: "success",
    message: "Sarah Jenkins accepted your connection request",
    icon: CheckCircle,
    iconColor: "text-green-600",
    unread: true,
  },
  {
    id: 2,
    type: "info",
    message: "New reply from Mike Ross",
    icon: MessageSquare,
    iconColor: "text-blue-600",
    unread: true,
  },
  {
    id: 3,
    type: "alert",
    message: "LinkedIn cookie expired. Please reconnect.",
    icon: AlertCircle,
    iconColor: "text-red-600",
    unread: false,
  },
];

export const AppLayout = ({ children, }: AppLayoutProps) => {
  const pathname = usePathname();
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(true);
  const [notifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  const breadcrumbs = useMemo(() => {
    const path = pathname.replace(/^\/app\/?/, '').split('/').filter((p) => p);
    return [
      ...path.map((p, index) => {
        return {
          label: p,
          href: `/app/${path.slice(0, index + 1).join('/')}`
        }
      })
    ]
  }, [pathname])
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href} className="capitalize">{crumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="capitalize">{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-3">
              {/* LinkedIn Status Indicator */}
              <LinkedInSessionStatus />

              {/* Notification Bell */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Notifications</h4>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {unreadCount} new
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      {notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className={`flex gap-3 p-3 rounded-lg border ${notification.unread ? "bg-accent/50" : "bg-background"
                              }`}
                          >
                            <Icon className={`h-5 w-5 ${notification.iconColor} flex-shrink-0`} />
                            <p className="text-sm">{notification.message}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
