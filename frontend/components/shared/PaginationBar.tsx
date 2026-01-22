"use client";

import { useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

type PaginationBarProps = {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (nextPage: number) => void;
  clamp?: boolean;
  className?: string;
};

function clampPage(p: number, totalPages: number) {
  return Math.min(Math.max(1, p), totalPages);
}

export function PaginationBar({
  page,
  totalItems,
  pageSize,
  onPageChange,
  clamp = true,
  className = "",
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = clamp ? clampPage(page, totalPages) : page;

  const pageWindow = useMemo(() => {
    if (totalPages <= 3)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 1) return [1, 2, 3];
    if (currentPage >= totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, totalPages]);

  const rangeText = useMemo(() => {
    if (totalItems === 0) return "";
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return `Showing ${start} – ${end} of ${totalItems}`;
  }, [currentPage, pageSize, totalItems]);

  if (totalItems <= pageSize) return null;

  return (
    <div className={`mt-5 flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="First page"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-muted-foreground 
          hover:bg-accent/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Previous page"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-muted-foreground 
          hover:bg-accent/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1">
          {pageWindow.map((p) => {
            const active = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={
                  active
                    ? "min-w-[2.25rem] rounded-full bg-transparent px-3 py-1 text-base font-semibold text-foreground ring-1 ring-border"
                    : "min-w-[2.25rem] rounded-full bg-transparent px-3 py-1 text-sm text-muted-foreground hover:bg-accent/15 hover:text-primary"
                }
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Next page"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-muted-foreground 
          hover:bg-accent/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Last page"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-muted-foreground 
          hover:bg-accent/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronDoubleRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">{rangeText}</div>
    </div>
  );
}
