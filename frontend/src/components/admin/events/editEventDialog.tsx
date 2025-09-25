import { CreateEventResponse, EventResponse, UpdateEventQuery } from "@/endpoints/gubenSchemas";
import { useTranslation } from "react-i18next";
import { DialogContent, Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventFormSchema } from "./editEventDialog.formSchema";
import { useCategoriesGetAll, useEventsUpdateEvent, useLocationsGetAll } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";

import EditEventDialogForm from "./editEventDialog.form";

interface IProps {
	event: EventResponse;
	onCreateSuccess: (date: CreateEventResponse) => Promise<void>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditEventDialog({ event, onCreateSuccess, open, onOpenChange }: IProps) {
	const { t } = useTranslation("events");

	const { mutateAsync } = useEventsUpdateEvent({
		onSuccess: async (data) => {
			onOpenChange(false);
			await onCreateSuccess(data);
		},
		onError: (error) => {
			useErrorToast(error);
		}
	})

	const handleSubmit = async (form: EventFormSchema) => {
		await mutateAsync({
			pathParams: { id: event.id },
			body: mapFormEditToEventQuery(form)
		});
	};

	const { data: categoryData } = useCategoriesGetAll({});
	const categories = categoryData?.categories ?? [];

	const categoryOptions = categories.map(c => ({
		label: c.name,
		value: c.id
	}));

	const { data: locationsData } = useLocationsGetAll({});
	const locations = locationsData?.locations ?? [];

	const locationsOptions = locations.map(l => ({
		label: [l.name, l.city, l.zip, l.street].filter(Boolean).join(", "),
		value: l.id
	}));


	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={"bg-white px-4 py-8 flex flex-col gap-2 max-w-screen-2xl"}>
				<DialogHeader>
					<DialogTitle>{t("Edit")}</DialogTitle>
				</DialogHeader>
				<EditEventDialogForm
					locationsOptions={locationsOptions}
					categoryOptions={categoryOptions}
					defaultData={mapEventToForm(event)}
					onSubmit={handleSubmit}
					onClose={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	)
}

function toDateTime(date: string) {
	return new Date(date).toISOString().slice(0, 16);
}

// we are currently doing nothing with the urls as well as the images, as for now i did not include them in the form, but they are already in the schema
function mapEventToForm(event: EventResponse): EventFormSchema {
	return {
		title: event.title ?? "",
		description: event.description ?? "",
		startDate: toDateTime(event.startDate) ?? "",
		endDate: toDateTime(event.endDate) ?? "",
		latitude: event.coordinates?.latitude ?? 0,
		longitude: event.coordinates?.longitude ?? 0,
		urls: event.urls?.map(u => ({
			title: u.description ?? "",
			url: u.link ?? ""
		})) ?? [],
		images: event.images,
		categoryIds: event.categories?.map(c => c.id) ?? [],
		locationId: event.location?.id ?? ""
	};
}

function mapFormEditToEventQuery(form: EventFormSchema): UpdateEventQuery {
	return {
		title: form.title,
		description: form.description,
		startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
		endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
		latitude: form.latitude,
		longitude: form.longitude,
		urls: form.urls?.map(u => ({
			description: u.title ?? "",
			link: u.url ?? ""
		})) ?? [],
		categoryIds: form.categoryIds || null,
		images: form.images,
		locationId: form.locationId
	}
}
