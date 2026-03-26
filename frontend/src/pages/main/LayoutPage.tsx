import { AppSidebar } from "@/components/main/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useLocation, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getStudentProject } from "@/services/project/api-project"

export default function LayoutPage() {
  const location = useLocation()
  const [projectTitle, setProjectTitle] = useState("")
  
  // Create breadcrumb based on current path
  const pathnames = location.pathname.split("/").filter((x) => x)
  const isProjectDetails = pathnames[0] === 'projects' && pathnames.length === 2
  const currentPage = pathnames[pathnames.length - 1] || "projects"

  useEffect(() => {
    if (isProjectDetails) {
      getStudentProject().then(p => {
        if (p) setProjectTitle(p.title)
      }).catch(() => {})
    }
  }, [isProjectDetails, currentPage])
  
  const formattedPageName = isProjectDetails 
    ? (projectTitle || "Loading...") 
    : currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/projects">Pages</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{formattedPageName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="min-h-11/12 flex m-4 mt-0 p-4 rounded-xl bg-muted/50">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
