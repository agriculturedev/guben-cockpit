import { useUsersGetAll } from "@/endpoints/gubenComponents";
import { useAuthHeaders } from "@/hooks/useAuthHeaders";
import { defaultPaginationProps, usePagination } from "@/hooks/usePagination";
import { useEffect } from "react";
import { PaginationContainer } from "@/components/DataDisplay/PaginationContainer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { t } from "i18next";

export const UserList = () => {
  const {
    page,
    pageCount,
    total,
    pageSize,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    setTotal,
    setPageCount
  } = usePagination();
  const headers = useAuthHeaders();

  const {data: pagedUserData, refetch, isLoading} = useUsersGetAll({
    queryParams: {
      pageSize, pageNumber: page
    },
    ...headers
  });

  useEffect(() => {
    setTotal(pagedUserData?.totalCount ?? defaultPaginationProps.total);
    setPageCount(pagedUserData?.pageCount ?? defaultPaginationProps.pageCount);
  }, [pagedUserData]);

  const users = pagedUserData?.results;

  return (
    <div className={"flex flex-col"}>
      <PaginationContainer
        nextPage={nextPage} previousPage={previousPage} setPageIndex={setPageIndex}
        setPageSize={setPageSize} total={total} pageCount={pageCount} pageSize={pageSize}
        page={page}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Name")}</TableHead>
              <TableHead>{t("Email")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data={users}>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>


      </PaginationContainer>

    </div>
  )
}
