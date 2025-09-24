import { TenantResponse, UpdateTenantQuery, UpdateTenantResponse } from "@/endpoints/gubenSchemas";
import { useTranslation } from "react-i18next";
import { FormSchema } from "./editBookingItemDialog.formSchema";
import { useErrorToast } from "@/hooks/useErrorToast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditBookingItemDialogForm from "./editBookingItemDialog.form";
import { useBookingUpdateTenant } from "@/endpoints/gubenComponents";

interface IProps {
  tenant: TenantResponse;
  onCreateSuccess: (data: UpdateTenantResponse) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditBookingItemDialog({ tenant, open, onOpenChange, ...props }: IProps) {
  const { t } = useTranslation("booking");

  const { mutateAsync } = useBookingUpdateTenant({
    onSuccess: async (data) => {
      onOpenChange(false);
      await props.onCreateSuccess(data);
    },
    onError: (error) => useErrorToast(error)
  });

  const handleSubmit = async (form: FormSchema) => {
    await mutateAsync({
      pathParams: { id: tenant.id },
      body: mapFormToEditTenantQuery(form)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"bg-white px-4 py-8 flex flex-col gap-2"}>
        <DialogHeader>
          <DialogTitle>{t("Edit")}</DialogTitle>
        </DialogHeader>
        <EditBookingItemDialogForm
          onSubmit={handleSubmit}
          defaultData={mapTenantToForm(tenant)}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
};

function mapTenantToForm(tenant: TenantResponse): FormSchema {
  return {
    tenantId: tenant.tenantId,
    forPublicUse: tenant.forPublicUse ?? false,
  }
}

function mapFormToEditTenantQuery(form: FormSchema): UpdateTenantQuery {
  return {
    tenantId: form.tenantId,
    forPublicUse: form.forPublicUse
  }
};
