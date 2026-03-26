// import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { Toaster } from "./components/ui/sonner.tsx"

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  // </StrictMode>
)
