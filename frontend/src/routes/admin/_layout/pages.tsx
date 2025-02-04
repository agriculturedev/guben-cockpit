import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import * as React from 'react'
import { Combobox } from "@/components/ui/comboBox";
import { EditPageForm } from "@/components/pages/editPage/editPageForm";

export const Route = createFileRoute('/admin/_layout/pages')({
  component: PagesAdminPanel
})

// TODO@JOREN: define from backend, make the GetPage endpoint accept an enum as id and define this enum in the backend with the correct options.
export enum Pages {
  Home = 'Home',
  Projects = 'Projects',
  Events = 'Events'
}

function PagesAdminPanel() {
  const { t } = useTranslation(['pages', 'common'])
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(Pages.Home);

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
