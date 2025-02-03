import { createFileRoute } from '@tanstack/react-router'
import { UserList } from "@/components/admin/UsersList";
import { View } from "@/components/layout/View";
import { AddProjectDialogButton } from "@/components/projects/createProject/CreateProjectDialogButton";
import { AuthGuard } from '@/guards/authGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapComponent } from "@/components/home/MapComponent";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardAdminPanel } from "@/components/dashboard/DashboardAdminPanel";
import { ProjectAdminPanel } from "@/components/projects/ProjectAdminPanel";

export const Route = createFileRoute('/admin')({
  component: AdminComponent,
})

function AdminComponent() {
  const {t} = useTranslation(["dashboard", "projects", "users", "events"]);

  return (
    <AuthGuard>
      <View>
        <Tabs defaultValue="Dashboard" className="w-full flex flex-col h-full" >
          <TabsList className={"flex flex-row font-bold pl-2"}>
           <TabsTrigger value={"Dashboard"}>{t("Title", {ns: "dashboard"})}</TabsTrigger>
           <TabsTrigger value={"Users"}>{t("Title", {ns: "users"})}</TabsTrigger>
           <TabsTrigger value={"Projects"}>{t("Title", {ns: "projects"})}</TabsTrigger>
           <TabsTrigger value={"Events"}>{t("Title", {ns: "events"})}</TabsTrigger>
          </TabsList>

          <TabsContent value={"Dashboard"}>
            <DashboardAdminPanel/>
          </TabsContent>

          <TabsContent value={"Users"}>
            <UserList />
          </TabsContent>

          <TabsContent value={"Projects"}>
            <ProjectAdminPanel/>
          </TabsContent>

          <TabsContent value={"Events"}>
          </TabsContent>

        </Tabs>
      </View>
    </AuthGuard>
  )
}
