import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Combobox } from "@/components/ui/comboBox";
import { EditPageForm } from "@/components/admin/pages/editPage/editPageForm";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { useCallback } from "react";
import { routePermissionCheck } from "@/guards/routeGuardChecks";
import { Permissions } from "@/auth/permissions";

const SelectedPageSchema = z.object({
  selectedPageId: z.string().optional(),
})

export const Route = createFileRoute('/admin/_layout/pages')({
  beforeLoad: async ({context, location}) => {
    await routePermissionCheck(context.auth, [Permissions.PageManager])
  },
  component: PagesAdminPanel,
  validateSearch: zodValidator(SelectedPageSchema),
})

// TODO@JOREN: define from backend, make the GetPage endpoint accept an enum as id and define this enum in the backend with the correct options.
export enum Pages {
  Home = 'Home',
  Projects = 'Projects',
  Events = 'Events'
}

function PagesAdminPanel() {
  const { t } = useTranslation(['pages', 'common'])
  const {selectedPageId} = Route.useSearch()
  const navigate = useNavigate({from: Route.fullPath})

  const setSelectedPageId = useCallback(async (selectedPageId?: string | null) => {
    await navigate({search: (search: {selectedPageId: string | undefined}) => ({...search, selectedPageId: selectedPageId ?? undefined})})
  }, [navigate]);

  const options = Object.values(Pages).map(value => ({
    label: value,
    value: value,
  }));

  return (
    <div className="flex flex-col gap-2">


      <div className="flex flex-col gap-2">
        <Label>{t("SelectItemToEdit", {ns: "common"})}</Label>
        <div className="flex gap-2">

          <Combobox
            options={options}
            placeholder={t("Search", {ns: "common"})}
            onSelect={setSelectedPageId}
            value={selectedPageId}
            defaultOpen={false}
          />
        </div>
      </div>

      {selectedPageId != null &&
        <EditPageForm key={selectedPageId} pageId={selectedPageId} /> // key is important for re-render on prop change
      }

    </div>
  )
}
