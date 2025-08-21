import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBookingDeleteTenantId } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IProps {
	tenantId: string;
	onDeleteSuccess: () => Promise<any>;
	children: React.ReactNode;
}

export default function DeleteBookingItemDialog({ tenantId, onDeleteSuccess, children }: IProps) {
	const { t } = useTranslation(["booking", "common"]);
	const [open, setOpen] = useState(false);

	const mutation = useBookingDeleteTenantId({
		onSuccess: async () => {
			setOpen(false);
			toast(t("booking:deletedSuccess"));
			await onDeleteSuccess();
		},
		onError: (error) => useErrorToast(error)
	});

	const onSubmit = useCallback(() => mutation.mutate({
		pathParams: {
			id: tenantId,
		}
	}), [mutation, tenantId]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>{children}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("common:Delete")}</DialogTitle>
				</DialogHeader>

				<ConfirmationDialogContent onConfirm={onSubmit} onClose={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}