import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function Layout({ 
  children,
  params 
}: { 
  children: React.ReactNode,
  params: Promise<{ lang: string }>
}) {
  return (
    <SidebarProvider>
      <AppSidebar params={params as any} />
      <main className="flex min-h-screen w-full flex-col">
        <div className="flex h-12 items-center border-b px-4">
          <SidebarTrigger />
        </div>
        <div className="flex-1 p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
