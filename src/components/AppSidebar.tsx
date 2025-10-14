import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Truck, 
  FileText, 
  UserPlus, 
  IndianRupee,
  BarChart3,
  Package,
  Users
} from "lucide-react";

const menuItems = [
  { title: "Rider Overview", url: "/rider-overview", icon: Users },
  { title: "Runsheet Management", url: "/runsheet-management", icon: FileText },
  { title: "Rider Onboarding", url: "/rider-onboarding-queue", icon: UserPlus },
  { title: "Cash Collection", url: "/cash-collection", icon: IndianRupee },
  { title: "Orders", url: "/orders", icon: Package },
  { title: "Analytics", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent";

  return (
    <Sidebar collapsible="icon"  className="border-r">
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Promode Agro</h2>
              <p className="text-xs text-muted-foreground">Rider Management</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}