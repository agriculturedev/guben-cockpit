import { useTranslation } from "react-i18next";
import { Copy } from "lucide-react";

import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const { t } = useTranslation("dashboard");

  return (
    <CustomTooltip text={t("CopyUrl")}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => navigator.clipboard.writeText(text)}
        title={t("CopyUrl")}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </CustomTooltip>
  );
};
