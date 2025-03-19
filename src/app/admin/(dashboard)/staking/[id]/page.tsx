"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useSearchParams } from "next/navigation";
import { listRequest } from "@/app/admin/(dashboard)/lib/api";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { useMemo } from "react";
import { DataTablePagination } from "@/components/data-table-pagination";
import * as React from "react";
import dayjs from "dayjs";

export default function AdminStakingId() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const request = useMemo(
    () => ({
      ...listRequest,
      ...Object.fromEntries(searchParams.entries()),
      userWalletId: parseInt(id as string),
    }),
    [searchParams.entries()],
  );

  const fetch = useAdminFetch();

  const listStakings = useSWR([`/v1/stakings/history`, request], (args) =>
    fetch(args[0], { query: args[1] }),
  );

  const stakingDetail = useSWR([`/v1/stakings/detail/${id}`], (args) =>
    fetch(args[0]),
  );

  const stakingTotal = useSWR([`/v1/stakings/status/total/me/${id}`], (args) =>
    fetch(args[0]),
  );

  return (
    <main className={"mx-auto p-10 flex flex-col w-full"}>
      <h1 className={"text-2xl font-bold"}>스테이킹 상세</h1>
      <Separator className={"my-4"} />

      <div className={"flex flex-col space-y-10"}>
        <div className={"grid grid-cols-7 gap-x-3"}>
          <Card className={"col-span-3"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">지갑 주소</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold">
                {stakingDetail.data?.solanaAddress}
              </div>
            </CardContent>
          </Card>

          <Card className={"col-span-2"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                총 스테이킹 수량
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stakingTotal.data?.totalStaked || "-"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                지급 Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stakingDetail.data?.doneRewardAmount?.toFixed(4)}
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
                {stakingDetail.data?.notRewardAmount?.toFixed(4)}
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          title={"스테이킹 현황"}
          total={listStakings.data?.total || 0}
          data={listStakings.data?.data ?? []}
          columns={[
            {
              accessorKey: "createdAt",
              header: "날짜",
              cell: (row) =>
                dayjs(row.getValue() as string).format("YYYY-MM-DD"),
            },
            { accessorKey: "amount", header: "스테이킹 수량" },
          ]}
        />
        <DataTablePagination
          request={request}
          total={listStakings.data?.total || 0}
        />
      </div>
    </main>
  );
}
