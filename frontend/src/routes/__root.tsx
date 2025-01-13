import * as React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navigation } from "@/components/layout/Navigation";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Footer } from "@/components/layout/Footer";

export const Route = createRootRoute({
  component: RootComponent,
})

// uncomment stuff below for sign in, should move to 'admin' page
function RootComponent() {
  // const auth = useAuth();
  //
  // useEffect(() => {
  //   if (!auth.isAuthenticated && !auth.error && !auth.isLoading) {
  //     void auth.signinRedirect();
  //   }
  // }, [auth]);

  // if (auth.isAuthenticated) {
    return (
      <div className={"min-h-dvh bg-background flex flex-col"}>
        <Navigation/>
        <Outlet/>
        {/*<ReactQueryDevtools initialIsOpen={false} position={"bottom"}/>*/}
        <Footer/>
        {/*<TanStackRouterDevtools position="bottom-left"/>*/}
      </div>
    )
  // }
}
