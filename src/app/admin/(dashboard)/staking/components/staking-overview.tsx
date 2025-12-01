"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Underkdollar } from "@/components/underkdollar";
import { SettlementSelect } from "@/components/settlement-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { listRequest } from "@/app/admin/(dashboard)/lib/api";
import useSWR from "swr";
import { AdminStakingEstimated } from "@/app/admin/(dashboard)/staking/components/estimated";
import { DataTable } from "@/components/data-table";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { useMemo, useState } from "react";
import { stringify } from "querystring";
import { DataTablePagination } from "@/components/data-table-pagination";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StakingOverview() {
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

  const listStakings = useSWR([`/stakings/list`, request], (args) =>
    fetch(args[0], { query: args[1] })
  );

  const stakingRewardStatus = useSWR([`/stakings/reward/status/0`], (args) =>
    fetch(args[0])
  );

  const stakingTotal = useSWR([`/stakings/status/total/me/0`], (args) =>
    fetch(args[0])
  );

  const [text, setText] = useState(request.search || "");

  const handleSearch = () => {
    router.push(
      `${pathname}?${stringify({ ...request, search: text, page: 1 })}`
    );
  };

  return (
    <div className={"flex flex-col space-y-6 md:space-y-10"}>
      <div className={"grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5"}>
        <div className={"flex flex-col space-y-3 md:space-y-4"}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                총 스테이킹 수량
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">
                {stakingTotal.data?.totalStaked}
              </div>
            </CardContent>
          </Card>
          <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Total Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">
                  {stakingRewardStatus.data?.totalReward}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  미지급 Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">
                  {stakingRewardStatus.data?.unclaimedReward}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <AdminStakingEstimated />
      </div>

      <DataTable
        onRowClick={(x: any) => router.push(`/admin/staking/${x.userWalletId}`)}
        title={"스테이킹 목록"}
        total={listStakings.data?.total || 0}
        data={listStakings.data?.data ?? []}
        columns={[
          { accessorKey: "userWalletId", header: "ID" },
          { accessorKey: "solanaAddress", header: "지갑주소" },
          { accessorKey: "stakingAmount", header: "스테이킹 수량" },
          { accessorKey: "totalRewardAmount", header: "총 Rewards" },
          { accessorKey: "doneRewardAmount", header: "지급 Rewards" },
          { accessorKey: "notRewardAmount", header: "미지급 Rewards" },
          { accessorKey: "claimedRewardAmount", header: "클레임 요청" },
        ]}
        toolbar={
          <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center w-full md:w-auto">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder={"지갑 주소 입력"}
              className={"w-full md:w-[300px] lg:w-[400px]"}
            />
            <Button
              variant="default"
              className="bg-primary text-black hover:bg-primary/90 font-medium w-full md:w-auto"
              onClick={handleSearch}
            >
              검색
            </Button>
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
          </div>
        }
      />
      <DataTablePagination
        request={request}
        total={listStakings.data?.total || 0}
      />
    </div>
  );
}
