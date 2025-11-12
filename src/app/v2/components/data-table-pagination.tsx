"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/app/v2/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/v2/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stringify } from "querystring";
import { ListRequest } from "@/app/admin/(dashboard)/lib/api";

export function DataTablePagination({
  total = 0,
  request,
}: {
  request: ListRequest;
  total?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  let { page, limit } = request;
  page = parseInt(page as any);
  limit = parseInt(limit as any);

  const pageCount = Math.ceil((total ?? 0) / limit);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground"></div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">노출수</p>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              router.replace(
                `${pathname}?${stringify({
                  ...request,
                  limit: value,
                  page: 1,
                })}`,
              );
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          페이지 {pageCount} 중 {page}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              router.replace(
                `${pathname}?${stringify({
                  ...request,
                  page: 1,
                })}`,
              );
            }}
            disabled={page === 1}
          >
            <span className="sr-only">처음</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              router.replace(
                `${pathname}?${stringify({
                  ...request,
                  page: page - 1,
                })}`,
              );
            }}
            disabled={page === 1}
          >
            <span className="sr-only">이전</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              router.replace(
                `${pathname}?${stringify({
                  ...request,
                  page: page + 1,
                })}`,
              );
            }}
            disabled={page >= pageCount}
          >
            <span className="sr-only">다음</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              router.replace(
                `${pathname}?${stringify({
                  ...request,
                  page: pageCount,
                })}`,
              );
            }}
            disabled={page >= pageCount}
          >
            <span className="sr-only">마지막</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
