import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { DialogContent, Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEventsPublishEvents } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IProps {
	eventId: string;
	isPublished: boolean;
	onToggleSuccess: () => Promise<void>;
	children: React.ReactNode;
}

export default function PublishEventDialog({ eventId, isPublished, onToggleSuccess, children }: IProps) {
	const { t } = useTranslation("events");
	const [open, setOpen] = useState(false);

	const publishMutation = useEventsPublishEvents({
		onSuccess: async () => {
			setOpen(false);
			toast(t("PublishSuccess"));
			await onToggleSuccess();
		},
		onError: (error) => useErrorToast(error),
	});

	const unpublishMutation = useEventsPublishEvents({
		onSuccess: async () => {
			setOpen(false);
			toast(t("UnpublishSuccess"));
			await onToggleSuccess();
		},
		onError: (error) => useErrorToast(error),
	});

	const onSubmit = useCallback(() => {
		const mutation = isPublished ? unpublishMutation : publishMutation;
		mutation.mutate({
			body: {
				publish: !isPublished,
				ids: [eventId]
			}
		});
	}, [isPublished, eventId, publishMutation, unpublishMutation]);

	const title = isPublished ? t("Unpublish") : t("Publish");
	const confirmationText = isPublished ? t("UnpublishConfirmation") : t("PublishConfirmation");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>{children}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<ConfirmationDialogContent onConfirm={onSubmit} onClose={() => setOpen(false)} confirmationText={confirmationText} />
			</DialogContent>
		</Dialog>
	);
};