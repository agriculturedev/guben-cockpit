import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import {useTranslation} from "react-i18next";
import { UserList } from "@/components/admin/UsersList";
import { View } from "@/components/layout/View";
import { AddProjectDialogButton } from "@/components/projects/createProject/CreateProjectDialogButton";

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
      <View>
        <div className={"flex flex-col gap-2"}>
          <AddProjectDialogButton/>
          <UserList/>
        </div>
      </View>
    )
  }
}
