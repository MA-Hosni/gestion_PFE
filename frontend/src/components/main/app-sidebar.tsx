import * as React from "react"
import {
  Bell,
  Frame
} from "lucide-react"

import { NavProjects } from "@/components/main/nav-projects"
import { NavUser } from "@/components/main/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Mohamed Ali Hosni",
    email: "mohamedali@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "Projects",
      url: "#",
      icon: Frame,
    },
    {
      name: "Notifications",
      url: "#",
      icon: Bell,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
            <div className="flex size-8 items-center justify-center rounded-md text-primary-foreground">
              <div 
                className="size-8 bg-blue-600 dark:bg-white transition-colors" 
                style={{
                  maskImage: "url(/favicon.svg)",
                  maskSize: "contain",
                  maskPosition: "center",
                  maskRepeat: "no-repeat",
                  WebkitMaskImage: "url(/favicon.svg)",
                  WebkitMaskSize: "contain",
                  WebkitMaskPosition: "center",
                  WebkitMaskRepeat: "no-repeat"
                }}
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">MentorLink</span>
                <span className="truncate text-xs">Enterprise</span>
            </div>
        </SidebarMenuButton>
        {/* <TeamSwitcher teams={data.teams} /> */}
        
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
