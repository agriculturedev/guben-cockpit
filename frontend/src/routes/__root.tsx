import * as React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from "@/components/layout/Navigation";
import "./index.css";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className={"min-h-screen flex flex-col bg-background"}>
      <Navigation/>
      <div className={"w-full flex-grow overflow-hidden"}>
        <Outlet/>
      </div>
      <Footer/>
      <Toaster/>
    </div>
  )
}
