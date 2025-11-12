"use client";

import { Separator } from "@/app/v2/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/v2/components/ui/card";
import { Underkdollar } from "@/app/v2/components/underkdollar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { listRequest } from "@/app/admin/(dashboard)/lib/api";
import useSWR from "swr";
import { DataTable } from "@/app/v2/components/data-table";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { useMemo, useState } from "react";
import { stringify } from "querystring";
import { DataTablePagination } from "@/app/v2/components/data-table-pagination";
import * as React from "react";
import { Button } from "@/app/v2/components/ui/button";
import { Input } from "@/app/v2/components/ui/input";
import { Checkbox } from "@/app/v2/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/v2/components/ui/select";
import Link from "next/link";
import dayjs from "dayjs";
import { SettlementSelect } from "@/app/v2/components/settlement-select";

export default function AdminSales() {
  const searchParams = useSearchParams();

  const request = useMemo(
    () => ({
      ...listRequest,
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams.entries()],
  );

  const fetch = useAdminFetch();
  const router = useRouter();
  const pathname = usePathname();

  const listStakings = useSWR(
    [`/v1/icosales/participate/list`, request],
    (args) => fetch(args[0], { query: args[1] }),
  );

  const icoStatus = useSWR([`/v1/icosales/status`], (args) => fetch(args[0]));

  const [text, setText] = useState(request.search || "");

  return (
    <main className={"mx-auto p-10 flex flex-col w-full"}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-2xl font-bold"}>ICO 관리</h1>
        <Link href={"/admin/sales/create"}>
          <Button>등록</Button>
        </Link>
      </div>
      <Separator className={"my-4"} />

      <div className={"flex flex-col space-y-10"}>
        <div className={"flex flex-col space-y-5"}>
          <div className={"grid grid-cols-4 gap-5"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ETH</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(icoStatus.data?.icoEthAmount || "0").toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SOL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(icoStatus.data?.icoSolAmount || "0").toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">BNB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(icoStatus.data?.icoBnbAmount || "0").toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">USDT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(icoStatus.data?.icoUSDTAmount || "0").toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className={"grid grid-cols-2 gap-5"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  지급 $GOTCAR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(icoStatus.data?.doneGocarAmount || "0").toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  미지급 $GOTCAR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(icoStatus.data?.notGocarAmount || "0").toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DataTable
          onRowClick={(x) =>
            router.push(`/admin/sales/${x.userWalletId}?sid=${x.id}`)
          }
          title={"ICO 판매 목록"}
          total={listStakings.data?.total || 0}
          data={listStakings.data?.data ?? []}
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
                  />
                </div>
              ),
            },
            {
              accessorKey: "created_at",
              header: "날짜",
              cell: (r) =>
                dayjs(r.getValue() as string).format("YYYY-MM-DD HH:mm"),
            },
            { accessorKey: "icoNetwork", header: "네트워크" },
            { accessorKey: "icoWalletAddress", header: "참여 지갑주소" },
            { accessorKey: "icoTokenSymbol", header: "토큰" },
            { accessorKey: "amount", header: "수량" },
            { accessorKey: "gocar_amount", header: "환산 $GOTCAR" },
          ]}
          rowActionButtons={[
            {
              label: "정산",
              onClick: async (data: any[]) => {
                fetch(`/v1/icosales/complete/settlements`, {
                  method: "POST",
                  data: {
                    ids: data.map((x) => x.userWalletId),
                  },
                }).then(listStakings.mutate);
              },
            },
          ]}
          toolbar={
            <>
              <div className={"flex space-x-2 items-center"}>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={"지갑 주소 입력"}
                  className={"w-[400px]"}
                />
                <Button
                  onClick={() => {
                    router.push(
                      `${pathname}?${stringify({ ...request, search: text, page: 1 })}`,
                    );
                  }}
                >
                  검색
                </Button>
              </div>
              <Underkdollar
                value={request.balanceSort}
                setValue={(balanceSort) => {
                  router.push(
                    `${pathname}?${stringify({ ...request, balanceSort, page: 1 })}`,
                  );
                }}
              />
              <SettlementSelect
                value={request.settlementSort}
                onChange={(settlementSort) => {
                  router.push(
                    `${pathname}?${stringify({ ...request, settlementSort, page: 1 })}`,
                  );
                }}
              />
              <Select
                value={request.typeSort}
                onValueChange={(typeSort) =>
                  router.push(
                    `${pathname}?${stringify({ ...request, typeSort, page: 1 })}`,
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="판매 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pub">퍼블릭</SelectItem>
                    <SelectItem value="pri">프라이빗</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </>
          }
        />
        <DataTablePagination
          request={request}
          total={listStakings.data?.total || 0}
        />
      </div>
    </main>
  );
}
