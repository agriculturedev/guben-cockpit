import { Permissions } from "@/auth/permissions";
import { createFileRoute } from "@tanstack/react-router";
import { routePermissionCheck } from '@/guards/routeGuardChecks'
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, EditIcon, TrashIcon, XIcon } from "lucide-react";
import { useBookingGetAllTenantIds } from "@/endpoints/gubenComponents";
import DeleteBookingItemDialog from "@/components/admin/booking/deleteBookingItemDialog";
import AddBookingItemDialog from "@/components/admin/booking/addBookingItemDialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import EditBookingItemDialog from "@/components/admin/booking/editBookingItemDialog";

export const Route = createFileRoute('/admin/_layout/booking')({
	beforeLoad: async ({ context, location }) => {
		await routePermissionCheck(context.auth, [Permissions.BookingManager])
	},
	component: BookingPage,
});

function BookingPage() {
	const { t } = useTranslation(["booking", "common"]);
	const { data: tenants, refetch } = useBookingGetAllTenantIds({});
	const onSuccess = async () => void await refetch();
	const [editTenantId, setEditTenantId] = useState<string | null>(null);

	return (
		<div className="w-full">
			<div className={"mb-4 flex justify-end"}>
				<AddBookingItemDialog onCreateSuccess={onSuccess}>
					<Button>{t('addTenant')}</Button>
				</AddBookingItemDialog>
			</div>
			<Table>
				<TableHeader>
					<TableHead>{t('tenantId')}</TableHead>
					<TableHead>{t('ForPublicUse')}</TableHead>
					<TableHead className="w-min">{t('common:Actions')}</TableHead>
				</TableHeader>
				<TableBody>
					{tenants?.tenants.map(t => (
						<TableRow>
							<TableCell>{t.tenantId}</TableCell>
							<TableCell className={"text-neutral-500"}>{t.forPublicUse == true ? <CheckIcon /> : <XIcon />}</TableCell>
							<TableCell>
								<TooltipProvider>
									<div className="h-full flex items-center gap-2">
										<button onClick={() => setEditTenantId(t.id)}>
											<EditIcon className="size-4 hover:text-red-500"/>
										</button>
										{editTenantId === t.id && (
											<EditBookingItemDialog
												tenant={t}
												onCreateSuccess={onSuccess}
												open={true}
												onOpenChange={(open) => { if (!open) setEditTenantId(null) }}>
											</EditBookingItemDialog>
										)}
										
										<DeleteBookingItemDialog tenantId={t.id} onDeleteSuccess={onSuccess}>
											<TrashIcon className="size-4 hover:text-red-500" />
										</DeleteBookingItemDialog>										
									</div>
								</TooltipProvider>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}