"use client";

import { Separator } from "@/app/v2/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/v2/components/ui/card";
import { Underkdollar } from "@/app/v2/components/underkdollar";
import { SettlementSelect } from "@/app/v2/components/settlement-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { listRequest } from "@/app/admin/(dashboard)/lib/api";
import useSWR from "swr";
import { AdminStakingEstimated } from "@/app/admin/(dashboard)/staking/components/estimated";
import { DataTable } from "@/app/v2/components/data-table";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { useMemo, useState } from "react";
import { stringify } from "querystring";
import { DataTablePagination } from "@/app/v2/components/data-table-pagination";
import * as React from "react";
import { Button } from "@/app/v2/components/ui/button";
import { Input } from "@/app/v2/components/ui/input";
import { Checkbox } from "@/app/v2/components/ui/checkbox";

export default function AdminStaking() {
  const searchParams = useSearchParams();

  const request = useMemo(
    () => ({
      ...listRequest,
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams.entries()]
  );

  const fetch = useAdminFetch();
  const router = useRouter();
  const pathname = usePathname();

  const listStakings = useSWR([`/v1/stakings/list`, request], (args) =>
    fetch(args[0], { query: args[1] })
  );

  const stakingRewardStatus = useSWR([`/v1/stakings/reward/status/0`], (args) =>
    fetch(args[0])
  );

  const stakingTotal = useSWR([`/v1/stakings/status/total/me/0`], (args) =>
    fetch(args[0])
  );

  const [text, setText] = useState(request.search || "");

  const handleSearch = () => {
    router.push(
      `${pathname}?${stringify({ ...request, search: text, page: 1 })}`
    );
  };

  return (
    <main
      className={"mx-auto p-10 flex flex-col w-full bg-white dark:bg-black"}
    >
      <h1 className={"text-2xl font-bold text-gray-900 dark:text-white"}>
        스테이킹 관리
      </h1>
      <Separator className={"my-4 border-gray-200 dark:border-gray-700"} />

      <div className={"flex flex-col space-y-10"}>
        <div className={"grid grid-cols-2 gap-5"}>
          <div className={"flex flex-col space-y-4"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  총 스테이킹 수량
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stakingTotal.data?.totalStaked}
                </div>
              </CardContent>
            </Card>
            <div className={"grid grid-cols-2 gap-4"}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stakingRewardStatus.data?.totalReward}
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
                  <div className="text-2xl font-bold">
                    {stakingRewardStatus.data?.unclaimedReward}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <AdminStakingEstimated />
        </div>

        <DataTable
          onRowClick={(x) => router.push(`/admin/staking/${x.userWalletId}`)}
          title={"스테이킹 목록"}
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
            { accessorKey: "solanaAddress", header: "지갑주소" },
            { accessorKey: "stakingAmount", header: "스테이킹 수량" },
            { accessorKey: "totalRewardAmount", header: "총 Rewards" },
            { accessorKey: "doneRewardAmount", header: "지급 Rewards" },
            { accessorKey: "notRewardAmount", header: "미지급 Rewards" },
          ]}
          rowActionButtons={[
            {
              label: "정산",
              onClick: async (data: any[]) => {
                fetch(`/v1/stakings/settlement/reward`, {
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
              <Underkdollar
                value={request.balanceSort}
                setValue={(balanceSort) => {
                  router.push(
                    `${pathname}?${stringify({ ...request, balanceSort, page: 1 })}`
                  );
                }}
              />
              <SettlementSelect
                value={request.settlementSort}
                onChange={(settlementSort) => {
                  router.push(
                    `${pathname}?${stringify({ ...request, settlementSort, page: 1 })}`
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
