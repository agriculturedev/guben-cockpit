import { useState } from "react";

interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export const defaultPaginationProps: PaginationProps = {
  page: 1,
  pageCount: 10,
  pageSize: 25,
  total: 0
}

export const usePagination = () => {
  const [page, setPage] = useState<number>(defaultPaginationProps.page);
  const [pageSize, setPageSize] = useState<number>(defaultPaginationProps.pageSize);
  const [total, setTotal] = useState<number>(defaultPaginationProps.total);
  const [pageCount, setPageCount] = useState<number>(defaultPaginationProps.pageCount);

  const nextPage = () => {
    if (page < pageCount) {
      return setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      return setPage(page - 1);
    }
  };

  const setPageIndex = (index: number) => {
    if (index >= 1 && index <= pageCount) {
      setPage(index);
    }
  };

  return {
    page,
    pageSize,
    total,
    pageCount,
    setPageSize,
    nextPage,
    previousPage,
    setPageIndex,
    setTotal,
    setPageCount
  }
}
