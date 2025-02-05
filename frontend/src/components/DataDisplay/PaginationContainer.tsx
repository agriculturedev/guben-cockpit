import {
  PageIndicator, PageSizePicker,
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { ReactNode } from "@tanstack/react-router";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface Props {
  nextPage: () => void;
  previousPage: () => void;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  children?: ReactNode;
}

export const PaginationContainer = ({
                                      nextPage,
                                      previousPage,
                                      setPageIndex,
                                      setPageSize,
                                      pageSize,
                                      children,
                                      page,
                                      pageCount,
                                      total
                                    }: Props) => {
  const {t} = useTranslation();

  return (
    <>
      <section>
        {children}
      </section>

      <Pagination>
        <PageIndicator>{`${t("Page")}: ${page} ${t("Of")} ${pageCount}, ${t("Total")}: ${total}`}</PageIndicator>
        <PageSizePicker value={pageSize} onChange={(value: string) => setPageSize(parseInt(value))}/>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => previousPage()}/>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => nextPage()}/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </>
  );
}
