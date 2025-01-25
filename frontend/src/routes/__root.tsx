import * as React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from "@/components/layout/Navigation";
import "./index.css";
import { Footer } from "@/components/layout/Footer";

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className={"min-h-dvh h-screen w-screen bg-background flex flex-col"}>
      <Navigation/>
      <div className={"h-full w-full flex overflow-auto"}>
        <Outlet/>
      </div>
      {/*<ReactQueryDevtools initialIsOpen={false} position={"bottom"}/>*/}
      <Footer/>
      {/*<TanStackRouterDevtools position="bottom-left"/>*/}
    </div>
  )
}
