"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

type UnstakingStatus = "NOT" | "APPROVED" | "DONE";

const statusLabels: Record<
  UnstakingStatus,
  { label: string; className: string }
> = {
  NOT: { label: "승인대기", className: "bg-orange-100 text-orange-800" },
  APPROVED: { label: "승인됨", className: "bg-blue-100 text-blue-800" },
  DONE: { label: "완료", className: "bg-green-100 text-green-800" },
};

export function UnstakingManagement() {
  const fetch = useAdminFetch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState<"all" | UnstakingStatus>("all");

  // 언스테이킹 요청 목록
  const unstakingList = useSWR([`/stakings/unstaking/list`, filter], (args) =>
    fetch(args[0], {
      query: { status: args[1] === "all" ? undefined : args[1] },
    })
  );

  const data = unstakingList.data?.data || [];

  // 상태별 카운트
  const pendingCount = data.filter((item: any) => item.status === "NOT").length;
  const approvedCount = data.filter(
    (item: any) => item.status === "APPROVED"
  ).length;
  const completedCount = data.filter(
    (item: any) => item.status === "DONE"
  ).length;

  // 승인대기 → 승인 처리 (7일 후 완료 예정)
  const handleApprove = async (ids: number[]) => {
    if (
      !confirm(
        `${ids.length}건의 언스테이킹 요청을 승인하시겠습니까?\n승인일로부터 7일 후 자동 완료됩니다.`
      )
    )
      return;

    setIsProcessing(true);
    try {
      await fetch(`/stakings/unstaking/approve`, {
        method: "POST",
        data: { ids },
      });
      unstakingList.mutate();
      alert("언스테이킹 요청이 승인되었습니다.");
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 7일 경과된 승인 건들 완료 처리
  const handleComplete = async () => {
    if (!confirm("7일이 경과된 승인 건들을 완료 처리하시겠습니까?")) return;

    setIsProcessing(true);
    try {
      await fetch(`/stakings/unstaking/complete`, {
        method: "POST",
        data: {},
      });
      unstakingList.mutate();
      alert("완료 처리되었습니다.");
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 완료 예정일 계산 (신청일 + 7일)
  const getCompletionDate = (createdAt: string) => {
    if (!createdAt) return "-";
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 7);
    return formatDate(date.toISOString());
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-6">
      {/* 상단 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card
          className={`cursor-pointer ${filter === "NOT" ? "ring-2 ring-orange-500" : ""}`}
          onClick={() => setFilter(filter === "NOT" ? "all" : "NOT")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              승인대기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-orange-500">
              {pendingCount}건
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${filter === "APPROVED" ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => setFilter(filter === "APPROVED" ? "all" : "APPROVED")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              승인됨 (7일 대기)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-blue-500">
              {approvedCount}건
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer ${filter === "DONE" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setFilter(filter === "DONE" ? "all" : "DONE")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-green-500">
              {completedCount}건
            </div>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <CardContent className="pt-6 space-y-2">
            <Button
              onClick={handleComplete}
              disabled={approvedCount === 0 || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              7일 경과 완료처리
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 언스테이킹 목록 테이블 */}
      <DataTable
        title={"언스테이킹 요청 목록"}
        total={data.length}
        data={data}
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
            accessorKey: "solAddress",
            header: "SOL 주소",
            cell: ({ row }) => row.original.solAddress || "-",
          },
          {
            accessorKey: "icoAddress",
            header: "ICO 주소",
            cell: ({ row }) => row.original.icoAddress || "-",
          },
          { accessorKey: "amount", header: "언스테이킹 수량" },
          {
            accessorKey: "createdAt",
            header: "신청일",
            cell: ({ row }) => formatDate(row.original.createdAt),
          },
          {
            accessorKey: "approvedAt",
            header: "승인일",
            cell: ({ row }) => formatDate(row.original.approvedAt),
          },
          {
            id: "completionDate",
            header: "완료 예정일",
            cell: ({ row }) =>
              row.original.status === "DONE"
                ? formatDate(row.original.completedAt)
                : getCompletionDate(row.original.createdAt),
          },
          {
            accessorKey: "status",
            header: "상태",
            cell: ({ row }) => {
              const status = row.original.status as UnstakingStatus;
              const { label, className } = statusLabels[status] || {
                label: status,
                className: "bg-gray-100 text-gray-800",
              };
              return (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
                >
                  {label}
                </span>
              );
            },
          },
        ]}
        rowActionButtons={[
          {
            label: "선택 승인",
            onClick: async (selected: any[]) => {
              const pendingItems = selected.filter(
                (item) => item.status === "NOT"
              );
              if (pendingItems.length === 0) {
                alert("승인대기 상태인 항목을 선택해주세요.");
                return;
              }
              handleApprove(pendingItems.map((x) => x.id));
            },
          },
        ]}
      />
    </div>
  );
}
