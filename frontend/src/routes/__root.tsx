import { createRootRoute, Outlet } from '@tanstack/react-router'
import "./index.css";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from '@/components/Navbar';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {TanStackRouterDevtools} from "@tanstack/router-devtools";

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
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools initialIsOpen={false} position={"bottom"} />
          <TanStackRouterDevtools position="bottom-left" />
        </>
      )}
    </div>
  )
}
