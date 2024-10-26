import * as React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/layout/Navigation";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Footer } from "@/components/layout/Footer";

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className={"min-h-dvh bg-background flex flex-col"}>
      <Navigation/>
      <QueryClientProvider client={queryClient}>
        <Outlet/>
        <ReactQueryDevtools initialIsOpen={false} position={"bottom"}/>
      </QueryClientProvider>
      <Footer/>
      <TanStackRouterDevtools position="bottom-left"/>
    </div>
  )
}
