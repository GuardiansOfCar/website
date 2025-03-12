"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Underkdollar } from "@/components/underkdollar";
import { SettlementSelect } from "@/components/settlement-select";
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

export default function AdminReferral() {
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
    [`/v1/referrals/settement/list`, request],
    (args) => fetch(args[0], { query: args[1] }),
  );

  const total = useSWR([`/v1/referrals/status/total`], (args) =>
    fetch(args[0]),
  );

  const [text, setText] = useState(request.search || "");

  return (
    <main className={"mx-auto p-10 flex flex-col w-full"}>
      <h1 className={"text-2xl font-bold"}>리퍼럴 관리</h1>
      <Separator className={"my-4"} />

      <div className={"flex flex-col space-y-10"}>
        <div className={"grid grid-cols-2 gap-4"}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {total.data?.totalReward}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                미지급 Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total.data?.notReward}</div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          onRowClick={(x) => router.push(`/admin/referral/${x.userWalletId}?sid=${x.id}`)}
          title={"리퍼럴 목록"}
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
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
              ),
            },
            { accessorKey: "icoWalletAddress", header: "지갑주소" },
            { accessorKey: "referralCode", header: "Code" },
            { accessorKey: "totalAmount", header: "총 Rewards" },
            { accessorKey: "doneAmount", header: "지급 Rewards" },
            { accessorKey: "notAmount", header: "미지급 Rewards" },
          ]}
          rowActionButtons={[
            {
              label: "정산",
              onClick: async (data: any[]) => {
                fetch(`/v1/stakings/referrals/settlement`, {
                  method: "PUT",
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
