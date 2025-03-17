import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { useEventsCreateEvent } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useTranslation } from "react-i18next";
import { EventFormSchema } from "@/components/admin/events/eventDialog.formSchema";
import { CreateEventQuery, CreateEventResponse } from "@/endpoints/gubenSchemas";
import { EventForm } from "./eventDialog.form";

interface IProps {
  children: ReactNode;
  onCreateSuccess: (data: CreateEventResponse) => Promise<void>;
}

//TODO: move to compound component design to prevent prop drilling
export default function AddEventDialog({children, ...props}: IProps) {
  const {t} = useTranslation("events");
  const [isOpen, setOpen] = useState<boolean>(false);

  const {mutateAsync} = useEventsCreateEvent({
    onSuccess: async (data) => {
      setOpen(false);
      await props.onCreateSuccess(data);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  })

  const handleSubmit = async (form: EventFormSchema) => {
    await mutateAsync({
      body: mapFormToCreateEventQuery(form)
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className={"bg-white px-4 py-8"}>
        <h1>{t("Add")}</h1>
        <EventForm
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function mapFormToCreateEventQuery(form: EventFormSchema): CreateEventQuery {
  return {
    title: form.title,
    description: form.description,
    startDate: form.startDate,
    endDate: form.endDate,
    latitude: form.latitude,
    longitude: form.longitude,
    urls: form.urls.map(u => {
      return {
        link: u.url,
        description: u.title
      }
    }),
    categoryIds: form.categoryIds,
    locationId: form.locationId,
  }
}
