

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
import { Home, Settings, LogOut } from "lucide-react"
import { signOutAction } from "@/app/actions/auth-actions"
import { getDictionary, Locale } from "@/app/[lang]/dictionaries"



export async function AppSidebar({ params }: { params: Promise<{ lang: Locale }> }) {

  const { lang } = await params;

  // Load the corresponding dictionary (en.json or es.json)
  const dict = await getDictionary(lang);

  // Example menu items
const items = [
  {
    title: dict.navigation.dashboard,
    url: "/dashboard",
    icon: Home,
  },
  {
    title: dict.navigation.settings,
    url: "/dashboard/settings",
    icon: Settings,
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
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
