import { DropdownForm } from "@/components/dashboard/DropdownForm";
import { useDropdownFromSchema } from "@/components/dashboard/useDropdownFormSchema";
import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDashboardDropdownUpdate } from "@/endpoints/gubenComponents";
import { DashboardDropdownResponse, UpdateDashboardDropdownQuery } from "@/endpoints/gubenSchemas";
import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { useErrorToast } from "@/hooks/useErrorToast";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

interface EditDropdownProps {
    dropdown: DashboardDropdownResponse;
    refetch: () => Promise<any>;
}

export const EditDropdownButton = ({ dropdown, refetch }: EditDropdownProps) => {
    const { t } = useTranslation("dashboard");
    const [open, setOpen] = useState(false);

    const mutation = useDashboardDropdownUpdate({
        onSuccess: () => {
            refetch?.();
            setOpen(false);
        },
        onError: (error) => useErrorToast(error),
    });

    const { formSchema, form } = useDropdownFromSchema(dropdown);
    const toggleDialog = useDialogFormToggle(form, setOpen);
    function onSubmit(values: z.infer<typeof formSchema>) {
        const UpdateDashboardDropdown: UpdateDashboardDropdownQuery = {
            title: values.title,
        };
        mutation.mutate({
            body: UpdateDashboardDropdown,
            pathParams: { id: dropdown.id }
        });
    }

    return (
        <Dialog open={open} onOpenChange={toggleDialog}>
            <DialogTrigger>
                <CustomTooltip text={t("EditTab")}>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title={t("EditTab")}
                    >
                        <EditIcon className="h-4 w-4" />
                    </Button>
                </CustomTooltip>
            </DialogTrigger>
                <DialogContent className={"min-w-fit"}>
                    <DialogHeader>
                        <DialogTitle>{t("EditTab")}</DialogTitle>
                    </DialogHeader>
                    <DropdownForm form={form} onSubmit={onSubmit} />
                </DialogContent>
        </Dialog>
    );
        
}