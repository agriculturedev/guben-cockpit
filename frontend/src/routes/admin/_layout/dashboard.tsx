import { EditDashboardCards } from '@/components/dashboard/cards/EditDashboardCards';
import { CreateDashboardTabDialogButton } from '@/components/dashboard/createDashboardTab/CreateDashboardTabDialogButton';
import { EditDashboardTab } from '@/components/dashboard/editDashboardTab/EditDashboardTab';
import { Combobox } from '@/components/ui/comboBox';
import { useDashboardGetAll } from '@/endpoints/gubenComponents';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next'
import { Label } from "@/components/ui/label";
import { z } from "zod";
import {zodValidator} from "@tanstack/zod-adapter";
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";

const SelectedTabSchema = z.object({
  selectedTabId: z.string().optional(),
})

export const Route = createFileRoute('/admin/_layout/dashboard')({
  beforeLoad: async ({context, location}) => {
    routePermissionCheck(context.auth, [Permissions.DashboardManager])
  },
  component: AdminDashboard,
  validateSearch: zodValidator(SelectedTabSchema),
})

function AdminDashboard() {
  const {t} = useTranslation(["dashboard", "common"]);
  const {selectedTabId} = Route.useSearch()
  const navigate = useNavigate({from: Route.fullPath})

  const {data, isFetching, refetch} = useDashboardGetAll({});

  const setSelectedTabId = useCallback(async (selectedTabId?: string | null) => {
    await navigate({search: (search: {selectedTabId: string | undefined}) => ({...search, selectedTabId: selectedTabId ?? undefined})})
  }, [navigate]);

  const onSave = useCallback(async () => {
    await refetch();
    await setSelectedTabId(undefined);
  }, [refetch]);

  const selectedTab = useMemo(() =>
    data?.tabs?.find(tab => tab.id == selectedTabId), [data?.tabs, selectedTabId]);

  const options = useMemo(() => data?.tabs
    ?.toSorted((a, b) => a.sequence - b.sequence)
    .map(tab => ({
      label: tab.title,
      value: tab.id
    })) ?? [], [data]);

  return (
    <div className='flex flex-col gap-8 max-h-full overflow-auto'>
      <div className="flex flex-col gap-2">
        <Label>{t("SelectItemToEdit", {ns: "common"})}</Label>
        <div className="flex gap-2">

          <Combobox
            options={options}
            placeholder={t("Search", {ns: "common"})}
            isLoading={isFetching}
            onSelect={setSelectedTabId}
            value={selectedTabId}
            defaultOpen={false}
          />
          <CreateDashboardTabDialogButton onSuccess={onSave}/>
        </div>
      </div>

      {selectedTab &&
        <div key={selectedTab.id}>
          <EditDashboardTab tab={selectedTab} onSuccess={refetch}/>
          <EditDashboardCards tab={selectedTab} refetch={refetch}/>
        </div>
      }
    </div>
  )
}
