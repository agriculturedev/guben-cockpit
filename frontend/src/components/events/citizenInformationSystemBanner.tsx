import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquareWarningIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MapComponent } from "../home/MapComponent";

export default function CitizenInformationSystemBanner() {
  const {t} = useTranslation("events");

  return (
    <section className="w-full bg-gubenAccent text-gubenAccent-foreground flex py-4 px-8 gap-2">
      <MessageSquareWarningIcon className="mr-2" />
      <p>{t("CitizenInformationText")}</p>
      <Dialog>
        <DialogTrigger>
          <a className={"underline"}>{t("ClickHere")}</a>
        </DialogTrigger>
        <DialogContent className="w-5/6 max-w-full h-5/6 p-1 pt-12">
          <MapComponent src={"https://www.sessionnet.guben.de/buergerinfo"} className={"h-full"} />
        </DialogContent>
      </Dialog>
    </section>
  )
}
