import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationDialogContent = ({onConfirm, onClose}: Props) => {
  const {t} = useTranslation();

  return (
    <>
      <p>{t("PermanentActionConfirmation")}</p>
      <DialogFooter>
        <Button onClick={onClose}>{t("No")}</Button>
        <Button onClick={onConfirm}>{t("Yes")}</Button>
      </DialogFooter>
    </>
  )
}