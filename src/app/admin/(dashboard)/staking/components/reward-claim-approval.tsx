"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function RewardClaimApproval() {
  const fetch = useAdminFetch();
  const [isApproving, setIsApproving] = useState(false);

  // CLAIMED 상태인 스테이킹 정산 목록 가져오기
  const claimList = useSWR([`/stakings/claim/list`], (args) =>
    fetch(args[0])
  );

  // 클레임 승인 요청 수 카운트
  const claimCount = claimList.data?.data?.length || 0;
  const totalClaimAmount =
    claimList.data?.data?.reduce(
      (sum: number, item: any) => sum + (item.claimedRewardAmount || 0),
      0
    ) || 0;

  const handleApproveAll = async () => {
    if (!confirm("모든 클레임 요청을 승인하시겠습니까?")) return;

    setIsApproving(true);
    try {
      await fetch(`/stakings/settlement/reward`, {
        method: "POST",
        data: {},
      });
      claimList.mutate();
      alert("클레임 승인이 완료되었습니다.");
    } catch (error) {
      alert("클레임 승인 중 오류가 발생했습니다.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-6">
      {/* 상단 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">승인 대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-orange-500">
              {claimCount}건
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              총 클레임 수량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {totalClaimAmount.toLocaleString()} GOCAR
            </div>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <CardContent className="pt-6">
            <Button
              onClick={handleApproveAll}
              disabled={claimCount === 0 || isApproving}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              {isApproving ? "처리 중..." : "전체 승인"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 클레임 목록 테이블 */}
      <DataTable
        title={"리워드 클레임 승인 대기"}
        total={claimCount}
        data={claimList.data?.data ?? []}
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
          { accessorKey: "icoAddress", header: "지갑주소" },
          { accessorKey: "stakingAmount", header: "스테이킹 수량" },
          { accessorKey: "notRewardAmount", header: "미지급 Rewards" },
          { accessorKey: "claimedRewardAmount", header: "클레임 요청 수량" },
          {
            accessorKey: "status",
            header: "상태",
            cell: ({ row }) => (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                승인대기
              </span>
            ),
          },
        ]}
        rowActionButtons={[
          {
            label: "선택 승인",
            onClick: async (data: any[]) => {
              if (data.length === 0) {
                alert("승인할 항목을 선택해주세요.");
                return;
              }
              if (!confirm(`${data.length}건의 클레임을 승인하시겠습니까?`))
                return;

              try {
                await fetch(`/stakings/settlement/reward`, {
                  method: "POST",
                  data: {
                    ids: data.map((x) => x.userWalletId),
                  },
                });
                claimList.mutate();
                alert("선택한 클레임이 승인되었습니다.");
              } catch (error) {
                alert("클레임 승인 중 오류가 발생했습니다.");
              }
            },
          },
        ]}
      />
    </div>
  );
}
