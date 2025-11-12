"use client";

import { Separator } from "@/app/v2/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/v2/components/ui/card";
import { useParams, useSearchParams } from "next/navigation";
import { listRequest } from "@/app/admin/(dashboard)/lib/api";
import useSWR from "swr";
import { DataTable } from "@/app/v2/components/data-table";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { useMemo } from "react";
import { DataTablePagination } from "@/app/v2/components/data-table-pagination";
import * as React from "react";
import dayjs from "dayjs";

export default function AdminReferralId() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const sid = searchParams.get("sid") as string;
  const request = useMemo(
    () => ({
      ...listRequest,
      ...Object.fromEntries(searchParams.entries()),
      userWalletId: parseInt(id as string),
    }),
    [searchParams.entries()],
  );

  const fetch = useAdminFetch();

  const listStakings = useSWR([`/v1/referrals/history/list`, request], (args) =>
    fetch(args[0], { query: args[1] }),
  );

  const stakingDetail = useSWR(
    [`/v1/referrals/settlement/detail/${sid}`],
    (args) => fetch(args[0]),
  );

  const stakingRewardStatus = useSWR(
    [`/v1/referrals/status/my/${id}`],
    (args) => fetch(args[0]),
  );

  return (
    <main className={"mx-auto p-10 flex flex-col w-full"}>
      <h1 className={"text-2xl font-bold"}>리퍼럴 상세</h1>
      <Separator className={"my-4"} />

      <div className={"flex flex-col space-y-10"}>
        <div className={"flex flex-col space-y-3"}>
          <div className={"grid grid-cols-7 gap-x-3"}>
            <Card className={"col-span-3"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">지갑 주소</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold">
                  {stakingDetail.data?.icoWalletAddress}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ETH</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    stakingRewardStatus.data?.icoEthAmount || "0"
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SOL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    stakingRewardStatus.data?.icoSolAmount || "0"
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">BNB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    stakingRewardStatus.data?.icoBnbAmount || "0"
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">USDT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    stakingRewardStatus.data?.icoUSDTAmount || "0"
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={"grid grid-cols-3 gap-x-3"}>
            <Card className={""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  총 REFERRAL REWARDS 수량
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                      stakingDetail.data?.totalAmount || "0"
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className={""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  지급 REWARDS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                      stakingDetail.data?.doneAmount || "0"
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className={""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  미지급 REWARDS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                      stakingDetail.data?.notAmount || "0"
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DataTable
          title={"리워드 현황"}
          total={listStakings.data?.total || 0}
          data={listStakings.data?.data ?? []}
          columns={[
            {
              accessorKey: "created_at",
              header: "날짜",
              cell: (row) =>
                dayjs(row.getValue() as string).format("YYYY-MM-DD"),
            },
            { accessorKey: "icoNetwork", header: "네트워크" },
            { accessorKey: "icoWalletAddress", header: "지갑주소" },
            { accessorKey: "icoTokenSymbol", header: "토큰유형" },
            { accessorKey: "icoAmount", header: "수량" },
            { accessorKey: "gocarAmount", header: "환산 $GOTCAR" },
            { accessorKey: "rewardAmount", header: "REWARDS 수량" },
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
