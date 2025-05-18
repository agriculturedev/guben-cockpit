import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface Props {
  onConfirm: () => void;
  onClose: () => void;
  confirmationText?: any;
}

export const ConfirmationDialogContent = ({onConfirm, onClose, confirmationText}: Props) => {
  const {t} = useTranslation();

  const text = confirmationText ? confirmationText : t("PermanentActionConfirmation");
  return (
    <>
      <p>{text}</p>
      <DialogFooter>
        <Button onClick={onClose}>{t("No")}</Button>
        <Button onClick={onConfirm}>{t("Yes")}</Button>
      </DialogFooter>
    </>
  )
}