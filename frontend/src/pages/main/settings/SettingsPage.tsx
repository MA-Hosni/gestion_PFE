import {
  Globe,
  Lock,
  Settings,
  UserCog,
} from "lucide-react"
import { useState } from "react"
import PersonalInfo from "@/components/settings/profile"
import ConnectedAccount from "@/components/settings/connect-account"
import EmailPassword from "@/components/settings/email-password"
import DeleteAccount from "@/components/settings/delete-account"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const data = {
  nav: [
    { name: "General", icon: UserCog },
    // { name: "Connected accounts", icon: Link },
    { name: "Privacy & visibility", icon: Lock },
    { name: "Language & region", icon: Globe },
    { name: "Advanced", icon: Settings },
  ],
}

export function SettingsPage({
  open,
  onOpenChange,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [activeItem, setActiveItem] = useState("General")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-150 md:max-w-250 lg:max-w-300">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          isActive={activeItem === item.name}
                          onClick={() => setActiveItem(item.name)}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-150 flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeItem}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {activeItem === "General" && (
                <div className="grid gap-6">
                  <PersonalInfo />
                  <ConnectedAccount />
                </div>
              )}
              {activeItem === "Privacy & visibility" && (
                <div className="grid gap-6">
                  <EmailPassword />
                  <DeleteAccount />
                </div>
              )}
              {activeItem !== "General" && activeItem !== "Privacy & visibility" && (
                 <div className="flex items-center justify-center h-full text-muted-foreground">
                    Content for {activeItem} will be added soon.
                 </div>
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
