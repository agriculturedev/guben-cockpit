import { EditDashboardCards } from '@/components/dashboard/cards/EditDashboardCards';
import { CreateDashboardTabDialogButton } from '@/components/dashboard/createDashboardTab/CreateDashboardTabDialogButton';
import { EditDashboardTab } from '@/components/dashboard/editDashboardTab/EditDashboardTab';
import { Combobox } from '@/components/ui/comboBox';
import { useDashboardGetAll } from '@/endpoints/gubenComponents';
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Label } from "@/components/ui/label";

export const Route = createFileRoute('/admin/_layout/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const {t} = useTranslation(["dashboard", "common"]);
  const {data, isFetching, refetch} = useDashboardGetAll({});
  const [selectedTabId, setSelectedTabId] = useState<string | undefined>();

  const onSave = useCallback(async () => {
    await refetch();
    setSelectedTabId(undefined);
  }, [refetch]);

  const selectedTab = useMemo(() =>
    data?.tabs?.find(tab => tab.id == selectedTabId), [selectedTabId]);

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
        <>
          <EditDashboardTab tab={selectedTab} onSuccess={onSave}/>
          <EditDashboardCards tab={selectedTab} refetch={onSave}/>
        </>
      }
    </div>
  )
}
