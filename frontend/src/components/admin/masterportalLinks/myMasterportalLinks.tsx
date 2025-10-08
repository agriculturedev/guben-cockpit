import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMasterportalLinksGetMy } from "@/endpoints/gubenComponents";

import { Status } from "./status";

export const MyMasterportalLinks = () => {
  const { t } = useTranslation(["common", "masterportal"]);
  const { data, isLoading } = useMasterportalLinksGetMy({});

  const links = data?.links || [];

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <Table className="w-full text-sm">
        <TableHeader className="bg-gray-50">
          <TableRow className="text-left">
            <TableHead className="px-4 py-3">{t("masterportal:Link")}</TableHead>
            <TableHead className="px-4 py-3">{t("masterportal:Folder")}</TableHead>
            <TableHead className="px-4 py-3">{t("masterportal:Name")}</TableHead>
            <TableHead className="px-4 py-3">{t("masterportal:Status")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="px-4 py-8 text-center text-gray-500"
              >
                {t("common:Loading")}...
              </TableCell>
            </TableRow>
          )}
          {!isLoading && links.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="px-4 py-8 text-center text-gray-500"
              >
                {t("common:NoResults")}
              </TableCell>
            </TableRow>
          )}

          {links.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.url}</TableCell>
              <TableCell>{row.folder}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Status value={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
