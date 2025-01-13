import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export const Route = createFileRoute('/admin')({
  component: AdminComponent,
})

function AdminComponent() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.error && !auth.isLoading) {
      void auth.signinRedirect();
    }
  }, [auth]);

  if (auth.isAuthenticated) {
    return (
      <div>
        admin test dashboard, keycloak login required
        welcome {auth.user?.profile.name}
      </div>
    )
  }
}
