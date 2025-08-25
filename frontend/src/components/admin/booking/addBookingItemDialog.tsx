import { useBookingCreateTenantId } from "@/endpoints/gubenComponents";
import { CreateTenantIdQuery, CreateTenantIdResponse } from "@/endpoints/gubenSchemas";
import { useErrorToast } from "@/hooks/useErrorToast";
import { ReactNode } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormSchema } from "./bookingItemDialog.formSchema";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddBookingItemDialogForm from "./addBookingItemDialog.form";

interface IProps {
	children: ReactNode;
	onCreateSuccess: (data: CreateTenantIdResponse) => Promise<void>;
}

export default function AddBookingItemDialog({children, onCreateSuccess}: IProps) {
	const { t } = useTranslation("booking");
	const [isOpen, setOpen] = useState(false);

	const {mutateAsync} = useBookingCreateTenantId({
		onSuccess: async (data) => {
			setOpen(false);
			await onCreateSuccess(data);
		},
		onError: (error) => useErrorToast(error)
	});

	const onSubmit = async (form: FormSchema) => {
		await mutateAsync({
			body: mapFormToCreateTenantId(form),
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger>
				{children}
			</DialogTrigger>
			
			<DialogContent className={"bg-white px-4 py-8"}>
				<DialogTitle>{t("addTenant")}</DialogTitle>
				<AddBookingItemDialogForm
					onSubmit={onSubmit}
					onClose={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function mapFormToCreateTenantId(form: FormSchema): CreateTenantIdQuery {
	return {
		tenantId: form.tenantId,
	}
}