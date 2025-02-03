import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AddProjectDialogButton } from "@/components/projects/createProject/CreateProjectDialogButton";

export const ProjectAdminPanel = () => {
  const {t} = useTranslation(["projects"]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-between items-center">
        <Label className={"text-xl"}>{t("MyProjects")}</Label>
        <AddProjectDialogButton />
      </div>

    </div>
  )
}
