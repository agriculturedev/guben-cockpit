import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  FooterItemResponse,
  UpsertFooterItemQuery, UpsertFooterItemResponse
} from "@/endpoints/gubenSchemas";
import { ReactNode, useState } from "react";

import {useFooterUpsertItem} from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useTranslation } from "react-i18next";
import UpsertFooterItemDialogForm from "./upsertFooterItemDialog.form";
import { FormSchema } from "./footerItemDialog.formSchema";

interface IProps {
  children: ReactNode;
  footerItem?: FooterItemResponse;
  onCreateSuccess: (data: any) => Promise<any>;
}

export default function UpsertFooterItemDialog({children, footerItem, ...props}: IProps) {
  const {t} = useTranslation("footer");
  const [isOpen, setOpen] = useState<boolean>(false);

  const {mutateAsync} = useFooterUpsertItem({
    onSuccess: async (data) => {
      setOpen(false);
      await props.onCreateSuccess(data);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  })

  const handleSubmit = async (form: FormSchema) => {
    await mutateAsync({
      body: mapFormToEditFooterItemQuery(form, footerItem)
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className={"bg-white px-4 py-8 flex flex-col gap-2"}>
        <DialogHeader>
          <DialogTitle>{t("Edit")}</DialogTitle>
        </DialogHeader>
        <UpsertFooterItemDialogForm
          defaultData={mapFooterItemToForm(footerItem)}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function mapFooterItemToForm(footerItem?: FooterItemResponse): FormSchema {
  return {
    name: footerItem?.name ?? "",
    content: footerItem?.content ?? "",
  }
}

function mapFormToEditFooterItemQuery(form: FormSchema, footerItem?: FooterItemResponse): UpsertFooterItemQuery {
  return {
    id: footerItem?.id,
    name: form.name,
    content: form.content,
  }
}
