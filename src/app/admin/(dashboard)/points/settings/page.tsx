"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Pencil, ChevronRight, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { DataTablePaginationPrefixed } from "@/components/data-table-pagination-prefixed";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ChangeReason enum 라벨
const changeReasonLabels: Record<string, string> = {
  WITHDRAW: "출금",
  ATTENDANCE: "출석",
  MOVING_EARN: "이동 적립",
  COMMENT: "댓글 작성",
  TIER_UPGRADE: "티어 업그레이드",
  WRITING: "글 작성",
  REGISTER: "회원가입",
  LIKE: "좋아요",
  INVITE_FRIEND: "친구 초대",
  GIFT: "선물",
  EXCHANGE_POINTS: "포인트 교환",
  REFERRAL: "리퍼럴",
  COUPON: "쿠폰",
  REFERRED_SUBMISSIONS: "피추천 제출",
  MONTHLY_MOVE_BONUS: "월간 이동 보너스",
  CONSECUTIVE_BONUS_5: "5일 연속 보너스",
  CONSECUTIVE_BONUS_10: "10일 연속 보너스",
};

export default function PointSettingsPage() {
  const fetch = useAdminFetch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 검색 필터 상태
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  // 페이지네이션
  const request = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || "",
      change_reason: searchParams.get("change_reason") || "",
      is_active: searchParams.get("is_active") || "",
    }),
    [searchParams]
  );

  // 포인트 지급 항목 조회
  const { data: settingsData, isLoading } = useSWR(
    ["/admin-point/settings", request],
    (args) => fetch(args[0], { query: args[1] })
  );

  const conditions = settingsData?.data || [];
  const pagination = settingsData?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchText);
    params.set("page", "1");
    if (conditionFilter !== "all") {
      params.set("change_reason", conditionFilter);
    } else {
      params.delete("change_reason");
    }
    if (statusFilter !== "all") {
      params.set("is_active", statusFilter);
    } else {
      params.delete("is_active");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setConditionFilter("all");
    setStatusFilter("all");
    setSearchText("");
    router.push(pathname);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/points/settings/${id}/edit`);
  };

  const columns = [
    {
      accessorKey: "changeReason",
      header: "지급 사유",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {changeReasonLabels[row.original.changeReason] ||
            row.original.changeReasonLabel ||
            row.original.changeReason}
        </span>
      ),
    },
    {
      accessorKey: "conditionName",
      header: "조건 이름",
      cell: ({ row }: any) => (
        <span className="text-sm font-medium">
          {row.original.conditionName || "-"}
        </span>
      ),
    },
    {
      accessorKey: "pointAmount",
      header: "지급 포인트",
      cell: ({ row }: any) => (
        <span className="font-medium text-cyan-400">
          {row.original.pointAmount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "활성 상태",
      cell: ({ row }: any) => (
        <span
          className={`text-sm ${
            row.original.isActive ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {row.original.isActive ? "활성" : "비활성"}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "수정",
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleEdit(row.original.id)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4 text-gray-400 hover:text-white" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 - 브레드크럼 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          포인트 지급 항목 조회
        </h1>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <span>포인트 지급 설정</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-cyan-400">포인트 지급 항목 조회</span>
        </div>
      </div>

      {/* 포인트 지급 항목 생성 버튼 */}
      <div className="flex justify-end">
        <Button
          onClick={() => router.push("/admin/points/settings/create")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          포인트 지급 항목 생성
        </Button>
      </div>

      {/* 조회 필터 카드 */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">조회</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 필터 행 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label className="w-20 text-sm text-gray-600 dark:text-gray-400 shrink-0">
                지급 사유
              </Label>
              <Select
                value={conditionFilter}
                onValueChange={setConditionFilter}
              >
                <SelectTrigger className="flex-1 dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700 max-h-60">
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="ATTENDANCE">출석</SelectItem>
                  <SelectItem value="MOVING_EARN">이동 적립</SelectItem>
                  <SelectItem value="INVITE_FRIEND">친구 초대</SelectItem>
                  <SelectItem value="REFERRAL">리퍼럴</SelectItem>
                  <SelectItem value="REGISTER">회원가입</SelectItem>
                  <SelectItem value="COUPON">쿠폰</SelectItem>
                  <SelectItem value="COMMENT">댓글 작성</SelectItem>
                  <SelectItem value="WRITING">글 작성</SelectItem>
                  <SelectItem value="LIKE">좋아요</SelectItem>
                  <SelectItem value="EXCHANGE_POINTS">포인트 교환</SelectItem>
                  <SelectItem value="TIER_UPGRADE">티어 업그레이드</SelectItem>
                  <SelectItem value="GIFT">선물</SelectItem>
                  <SelectItem value="MONTHLY_MOVE_BONUS">
                    월간 이동 보너스
                  </SelectItem>
                  <SelectItem value="CONSECUTIVE_BONUS_5">
                    5일 연속 보너스
                  </SelectItem>
                  <SelectItem value="CONSECUTIVE_BONUS_10">
                    10일 연속 보너스
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-20 text-sm text-gray-600 dark:text-gray-400 shrink-0">
                활성 상태
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1 dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="true">활성</SelectItem>
                  <SelectItem value="false">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 검색 행 */}
          <div className="flex items-center gap-4">
            <Label className="w-20 text-sm text-gray-600 dark:text-gray-400 shrink-0">
              검색
            </Label>
            <Input
              placeholder="조건 이름으로 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder:text-gray-500"
            />
          </div>

          {/* 버튼 행 */}
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-28 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-600"
            >
              초기화
            </Button>
            <Button
              onClick={handleSearch}
              className="w-28 bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 목록 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">목록</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm">
              검색결과{" "}
              <span className="text-cyan-400 font-medium">
                {pagination.total}
              </span>
            </span>
          </div>
        </div>

        {/* 테이블 */}
        <div className="rounded-lg border dark:border-zinc-800 overflow-hidden">
          <DataTable columns={columns} data={conditions} />
        </div>

        <DataTablePaginationPrefixed
          request={request}
          total={pagination.total}
        />
      </div>
    </div>
  );
}
