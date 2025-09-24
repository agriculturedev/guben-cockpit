import ReactDOM from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import "./utilities"
import "./index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProps, AuthProvider, AuthState, useAuth } from "react-oidc-context";
import { User } from "oidc-client-ts";

import "./utilities/i18n/initializeTranslations.ts";
import "./utilities/dateExtensions";
import {FetchInterceptor} from "./utilities/fetchApiExtensions";
import { useEffect } from 'react'

// Type declaration for Matomo Tag Manager
declare global {
  interface Window {
    _mtm: any[];
  }
}


FetchInterceptor.register();

const queryClient = new QueryClient();

export interface RouterContext {
  queryClient: QueryClient;
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: AuthContextProps;
}

// Set  up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
    auth: undefined!
  },
  defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const oidcConfig = {
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: import.meta.env.VITE_AUDIENCE,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  automaticSilentRenew: true,
};

console.log(import.meta.env)

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <AuthProvider onSigninCallback={(user: User | undefined) => console.log(user)} {...oidcConfig}>
      <App/>
    </AuthProvider>
  )
}

function App() {
  const auth = useAuth();

  useEffect(() => {
    var _mtm = window._mtm = window._mtm || [];
    _mtm.push({
      'mtm.startTime': (new Date().getTime()),
      'event': 'mtm.Start'
    });
    
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = 'https://matomo.guben.elie.de/js/container_104CZK1x.js';

    if (s.parentNode) {
      s.parentNode.insertBefore(g, s);
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{queryClient, auth}}/>
    </QueryClientProvider>
  )
}
