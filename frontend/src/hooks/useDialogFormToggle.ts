import { UseFormReturn } from "react-hook-form";
import { SetStateAction, useCallback } from "react";

export const useDialogFormToggle = (form: UseFormReturn<any>, setOpen: (value: SetStateAction<boolean>) => void) => {
  return useCallback((open: boolean) => {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  }, [form, setOpen]);
};