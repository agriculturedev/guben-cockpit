import { Permissions } from "@/auth/permissions";
import { createFileRoute } from "@tanstack/react-router";
import { routePermissionCheck } from '@/guards/routeGuardChecks'
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon } from "lucide-react";
import { useBookingGetAllTenantIds } from "@/endpoints/gubenComponents";
import DeleteBookingItemDialog from "@/components/admin/booking/deleteBookingItemDialog";
import AddBookingItemDialog from "@/components/admin/booking/addBookingItemDialog";

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
					<TableHead className="w-min">{t('common:Actions')}</TableHead>
				</TableHeader>
				<TableBody>
					{tenants?.tenants.map(t => (
						<TableRow>
							<TableCell>{t.tenantId}</TableCell>
							<TableCell>
								<DeleteBookingItemDialog tenantId={t.id} onDeleteSuccess={onSuccess}>
									<TrashIcon className="size-4 hover:text-red-500" />
								</DeleteBookingItemDialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}