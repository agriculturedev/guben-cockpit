import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { useLocationsCreate } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useTranslation } from "react-i18next";
import { CreateEventResponse, CreateLocationQuery } from "@/endpoints/gubenSchemas";
import { LocationForm } from "@/components/admin/locations/locationDialog.form";
import { LocationFormSchema } from "@/components/admin/locations/locationDialog.formSchema";

interface IProps {
  children: ReactNode;
  onCreateSuccess: (data: CreateEventResponse) => Promise<unknown>;
}

//TODO: move to compound component design to prevent prop drilling
export default function AddLocationDialog({children, ...props}: IProps) {
  const {t} = useTranslation("locations");
  const [isOpen, setOpen] = useState<boolean>(false);

  const {mutateAsync} = useLocationsCreate({
    onSuccess: async (data) => {
      setOpen(false);
      await props.onCreateSuccess(data);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  })

  const handleSubmit = async (form: LocationFormSchema) => {
    await mutateAsync({
      body: mapFormToCreateLocationQuery(form)
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className={"bg-white px-4 py-8"}>
        <h1>{t("Add")}</h1>
        <LocationForm
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function mapFormToCreateLocationQuery(form: LocationFormSchema): CreateLocationQuery {
  return {
    name: form.name,
    city: form.city,
    zip: form.zip,
    street: form.street,
    telephoneNumber: form.telephoneNumber,
    email: form.email,
    fax: form.fax
  }
}
