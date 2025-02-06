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
    <div className={"min-h-dvh h-screen w-screen bg-background flex flex-col"}>
      <Navbar />

      <div className={"h-full w-full flex overflow-auto"}>
        <Outlet/>
      </div>
      {/*<ReactQueryDevtools initialIsOpen={false} position={"bottom"}/>*/}
      <Footer/>
      {/*<TanStackRouterDevtools position="bottom-left"/>*/}
      <Toaster/>
    </div>
  )
}
