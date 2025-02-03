import { EditDashboardCards } from '@/components/dashboard/cards/EditDashboardCards';
import { CreateDashboardTabDialogButton } from '@/components/dashboard/createDashboardTab/CreateDashboardTabDialogButton';
import { EditDashboard } from '@/components/dashboard/EditDashboard';
import { EditDashboardTab } from '@/components/dashboard/editDashboardTab/EditDashboardTab';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/comboBox';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDashboardGetAll } from '@/endpoints/gubenComponents';
import { DashboardTabResponse } from '@/endpoints/gubenSchemas';
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/admin/_layout/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { t } = useTranslation(["dashboard", "common"]);
  const { data, isFetching, refetch} = useDashboardGetAll({});
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
      <div className="flex items-center gap-2">
        {/* <Label>{t("SelectTabToEdit")}</Label> */}
        <Combobox
          options={options}
          placeholder={t("Search", { ns: "common" })}
          isLoading={isFetching}
          onSelect={setSelectedTabId}
          value={selectedTabId}
          defaultOpen={false}
        />
        <CreateDashboardTabDialogButton onSuccess={onSave} />
      </div>

      {selectedTab &&
        <>
          <EditDashboardTab tab={selectedTab} onSuccess={onSave} />
          <EditDashboardCards tab={selectedTab} refetch={onSave} />
        </>
      }
    </div >
  )
}
