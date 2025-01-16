import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import {useTranslation} from "react-i18next";
import { UserList } from "@/components/admin/AllUsers";

export const Route = createFileRoute('/admin')({
  component: AdminComponent,
})

function AdminComponent() {
  const {t} = useTranslation();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.error && !auth.isLoading) {
      void auth.signinRedirect( {redirect_uri: `${window.location}`} );
    }
  }, [auth]);

  if (auth.isAuthenticated) {
    return (
      <div className={"flex flex-col"}>
        <p>admin test dashboard, keycloak login required</p>
        <p>welcome {auth.user?.profile.name}</p>
        <p>{t("Test")}</p>
        <UserList/>
      </div>
    )
  }
}
