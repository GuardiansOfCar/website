"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { listRequest } from "@/app/admin/(dashboard)/lib/api";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { useMemo, useState } from "react";
import { stringify } from "querystring";
import { DataTablePagination } from "@/components/data-table-pagination";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";

export default function AdminUnstaking() {
  const searchParams = useSearchParams();

  const request = useMemo(
    () => ({
      ...listRequest,
      ...Object.fromEntries(searchParams.entries()),
      status: searchParams.get("status") || "all",
    }),
    [searchParams]
  );

  const fetch = useAdminFetch();
  const router = useRouter();
  const pathname = usePathname();

  const listUnstaking = useSWR(
    [`/stakings/unstaking/list`, request],
    (args) => fetch(args[0], { query: args[1] })
  );

  const [text, setText] = useState(request.search || "");

  const handleSearch = () => {
    router.push(
      `${pathname}?${stringify({ ...request, search: text, page: 1 })}`
    );
  };

  const handleStatusChange = (status: string) => {
    router.push(`${pathname}?${stringify({ ...request, status, page: 1 })}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NOT":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            대기중
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            승인됨
          </span>
        );
      case "DONE":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            완료
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <main
      className={"mx-auto p-10 flex flex-col w-full bg-white dark:bg-black"}
    >
      <h1 className={"text-2xl font-bold text-gray-900 dark:text-white"}>
        언스테이킹 관리
      </h1>
      <Separator className={"my-4 border-gray-200 dark:border-gray-700"} />

      <div className={"flex flex-col space-y-10"}>
        <div className={"grid grid-cols-3 gap-5"}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">대기중 요청</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {listUnstaking.data?.data?.filter(
                  (x: any) => x.status === "NOT"
                ).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                승인됨 (7일 대기중)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {listUnstaking.data?.data?.filter(
                  (x: any) => x.status === "APPROVED"
                ).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {listUnstaking.data?.data?.filter(
                  (x: any) => x.status === "DONE"
                ).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title={"언스테이킹 요청 목록"}
          total={listUnstaking.data?.total || 0}
          data={listUnstaking.data?.data ?? []}
          columns={[
            {
              id: "select",
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label="Select all"
                />
              ),
              cell: ({ row }) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    disabled={row.original.status !== "NOT"}
                  />
                </div>
              ),
            },
            { accessorKey: "walletAddress", header: "지갑주소" },
            {
              accessorKey: "amount",
              header: "언스테이킹 수량",
              cell: ({ row }) => (
                <span>{row.original.amount?.toLocaleString()} GOTCAR</span>
              ),
            },
            {
              accessorKey: "status",
              header: "상태",
              cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
              accessorKey: "createdAt",
              header: "신청일",
              cell: ({ row }) =>
                dayjs(row.original.createdAt).format("YYYY-MM-DD HH:mm"),
            },
            {
              accessorKey: "approvedAt",
              header: "승인일",
              cell: ({ row }) =>
                row.original.approvedAt
                  ? dayjs(row.original.approvedAt).format("YYYY-MM-DD HH:mm")
                  : "-",
            },
            {
              accessorKey: "expectedCompleteAt",
              header: "완료 예정일",
              cell: ({ row }) =>
                row.original.expectedCompleteAt
                  ? dayjs(row.original.expectedCompleteAt).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : "-",
            },
          ]}
          rowActionButtons={[
            {
              label: "승인",
              onClick: async (data: any[]) => {
                const notApproved = data.filter((x) => x.status === "NOT");
                if (notApproved.length === 0) {
                  alert("승인할 수 있는 항목이 없습니다.");
                  return;
                }
                if (
                  !confirm(
                    `${notApproved.length}개의 언스테이킹 요청을 승인하시겠습니까?\n승인 후 7일 뒤 자동으로 언스테이킹이 완료됩니다.`
                  )
                ) {
                  return;
                }
                await fetch(`/stakings/unstaking/approve`, {
                  method: "POST",
                  data: {
                    ids: notApproved.map((x) => x.id),
                  },
                });
                listUnstaking.mutate();
              },
            },
            {
              label: "완료 처리 (수동)",
              onClick: async () => {
                if (
                  !confirm(
                    "승인 후 7일이 경과한 모든 언스테이킹 요청을 완료 처리하시겠습니까?"
                  )
                ) {
                  return;
                }
                await fetch(`/stakings/unstaking/complete`, {
                  method: "POST",
                });
                listUnstaking.mutate();
              },
            },
          ]}
          toolbar={
            <>
              <div className={"flex space-x-2 items-center"}>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder={"지갑 주소 입력"}
                  className={"w-[400px]"}
                />
                <Button
                  variant="default"
                  className="bg-primary text-black hover:bg-primary/90 font-medium"
                  onClick={handleSearch}
                >
                  검색
                </Button>
              </div>
              <Select value={request.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="NOT">대기중</SelectItem>
                  <SelectItem value="APPROVED">승인됨</SelectItem>
                  <SelectItem value="DONE">완료</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
        <DataTablePagination
          request={request}
          total={listUnstaking.data?.total || 0}
        />
      </div>
    </main>
  );
}
