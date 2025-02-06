import { createRootRoute, Outlet } from '@tanstack/react-router'
import "./index.css";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from '@/components/Navbar';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className={"min-h-screen flex flex-col bg-background"}>
      <Navbar />
      <div className={"w-full flex-grow overflow-hidden"}>
        <Outlet/>
      </div>
      <Footer/>
      <Toaster/>
    </div>
  )
}
