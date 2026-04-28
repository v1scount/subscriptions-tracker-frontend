

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Settings, LogOut, LayoutGrid, Shield } from "lucide-react"
import { signOutAction } from "@/app/actions/auth-actions"
import { getDictionary, Locale } from "@/app/[lang]/dictionaries"
import { auth } from "@/auth"



export async function AppSidebar({ params }: { params: Promise<{ lang: Locale }> }) {

  const { lang } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  console.log(session);

  // Load the corresponding dictionary (en.json or es.json)
  const dict = await getDictionary(lang);

  // Main menu items
const mainItems = [
  {
    title: dict.navigation.dashboard,
    url: "/dashboard",
    icon: Home,
  },
  {
    title: dict.navigation.subscriptions || "Subscriptions",
    url: "/dashboard/subscriptions",
    icon: LayoutGrid,
  },
  {
    title: dict.navigation.settings,
    url: "/dashboard/settings",
    icon: Settings,
  },
]

// Admin menu items
const adminItems = [
  {
    title: dict.navigation.catalog || "Catalog",
    url: "/dashboard/admin/catalog",
    icon: Shield,
  },
]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-12 items-center px-4 font-bold text-lg">
          Subs Tracker
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{dict.navigation.menu || "Menu"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} className="w-full">
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>{dict.navigation.admin || "Admin"}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} className="w-full">
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOutAction}>
              <SidebarMenuButton type="submit">
                <LogOut />
                <span>{dict.navigation.logout}</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
