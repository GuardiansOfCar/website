"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { ChevronRight, Calendar, Check, X, Loader2 } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

// 지급 상태 라벨
const exchangeStatusLabels: Record<
  string,
  { label: string; className: string }
> = {
  COMPLETED: { label: "교환 완료", className: "text-white" },
  PENDING: {
    label: "검토 필요",
    className: "text-cyan-400 underline cursor-pointer",
  },
  REJECTED: { label: "거절 (거절사유)", className: "text-white" },
  FAILED: { label: "교환 실패", className: "text-red-500" },
};

// 교환 포인트량 라벨
const pointAmountLabels: Record<string, string> = {
  "1000": "1,000 이상",
  "5000": "5,000 이상",
  "10000": "10,000 이상",
  "30000": "30,000 이상",
  "50000": "50,000 이상",
};

// 날짜 범위 프리셋
type DatePreset = "all" | "today" | "week" | "month" | "custom";

export default function PointExchangeHistoryPage() {
  const fetch = useAdminFetch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 검색 필터 상태
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pointAmountFilter, setPointAmountFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  // 승인/거절 모달 상태
  const [selectedExchange, setSelectedExchange] = useState<any>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 페이지네이션
  const request = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      sort: string;
      search?: string;
      status?: string;
      point_amount?: string;
      start_date?: string;
      end_date?: string;
    } = {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      sort: searchParams.get("sort") || "exchangedAt",
    };

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const pointAmount = searchParams.get("pointAmount");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (search) params.search = search;
    if (status) params.status = status;
    if (pointAmount) params.point_amount = pointAmount;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return params;
  }, [searchParams]);

  // 포인트 교환 내역 조회
  const {
    data: historyData,
    isLoading,
    mutate: refreshData,
  } = useSWR(["/admin-point/exchange-history", request], (args) =>
    fetch(args[0], { query: args[1] })
  );

  const history = historyData?.data || [];
  const pagination = historyData?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
  };

  // 승인 처리
  const handleApprove = async () => {
    if (!selectedExchange) return;
    setIsProcessing(true);
    try {
      const result = await fetch(
        `/admin-point/exchange/${selectedExchange.id}/approve`,
        {
          method: "PUT",
          data: {},
        }
      );
      if (result?.success) {
        alert("교환 요청이 승인되었습니다.");
        refreshData();
      } else {
        alert(result?.message || "승인 처리에 실패했습니다.");
      }
    } catch (error: any) {
      alert(error?.message || "승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      setIsApproveModalOpen(false);
      setSelectedExchange(null);
    }
  };

  // 거절 처리
  const handleReject = async () => {
    if (!selectedExchange || !rejectReason.trim()) {
      alert("거절 사유를 입력해주세요.");
      return;
    }
    setIsProcessing(true);
    try {
      const result = await fetch(
        `/admin-point/exchange/${selectedExchange.id}/reject`,
        {
          method: "PUT",
          data: { reason: rejectReason },
        }
      );
      if (result?.success) {
        alert("교환 요청이 거절되었습니다.");
        refreshData();
      } else {
        alert(result?.message || "거절 처리에 실패했습니다.");
      }
    } catch (error: any) {
      alert(error?.message || "거절 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      setIsRejectModalOpen(false);
      setSelectedExchange(null);
      setRejectReason("");
    }
  };

  const handleDatePreset = (preset: DatePreset) => {
    setDatePreset(preset);
    const today = new Date();

    switch (preset) {
      case "all":
        // 전체 선택 시 날짜 필터 초기화
        setStartDate("");
        setEndDate("");
        break;
      case "today":
        const todayStr = today.toISOString().split("T")[0].replace(/-/g, ".");
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        setStartDate(weekAgo.toISOString().split("T")[0].replace(/-/g, "."));
        setEndDate(today.toISOString().split("T")[0].replace(/-/g, "."));
        break;
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        setStartDate(monthAgo.toISOString().split("T")[0].replace(/-/g, "."));
        setEndDate(today.toISOString().split("T")[0].replace(/-/g, "."));
        break;
      case "custom":
        // 사용자 정의 - 날짜 그대로 유지
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchText);
    params.set("page", "1");
    if (pointAmountFilter !== "all") {
      params.set("pointAmount", pointAmountFilter);
    } else {
      params.delete("pointAmount");
    }
    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }
    if (startDate) {
      params.set("startDate", startDate.replace(/\./g, "-"));
    } else {
      params.delete("startDate");
    }
    if (endDate) {
      params.set("endDate", endDate.replace(/\./g, "-"));
    } else {
      params.delete("endDate");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setDatePreset("all");
    setStartDate("");
    setEndDate("");
    setPointAmountFilter("all");
    setStatusFilter("all");
    setSearchText("");
    router.push(pathname);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const columns = [
    {
      accessorKey: "userName",
      header: "회원 이름",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.original.user?.name || row.original.userName || "-"}
        </span>
      ),
    },
    {
      accessorKey: "exchangedAt",
      header: "교환 날짜",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.original.exchangedAt
            ? new Date(row.original.exchangedAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "points",
      header: "교환 포인트",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.original.points?.toLocaleString() || "-"}
        </span>
      ),
    },
    {
      accessorKey: "coinAmount",
      header: "코인량",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.original.coinAmount?.toLocaleString() || "-"}{" "}
          {row.original.coinSymbol || ""}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "지급 상태",
      cell: ({ row }: any) => {
        const status = row.original.status || "COMPLETED";
        const statusInfo = exchangeStatusLabels[status] || {
          label: status,
          className: "text-gray-500",
        };
        return (
          <span className={`text-sm ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "관리",
      cell: ({ row }: any) => {
        const status = row.original.status;
        // PENDING 또는 R(요청됨) 상태일 때만 승인/거절 버튼 표시
        if (status === "PENDING" || status === "R") {
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 text-white border-green-600"
                onClick={() => {
                  setSelectedExchange(row.original);
                  setIsApproveModalOpen(true);
                }}
              >
                <Check className="h-3 w-3 mr-1" />
                승인
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 text-white border-red-600"
                onClick={() => {
                  setSelectedExchange(row.original);
                  setIsRejectModalOpen(true);
                }}
              >
                <X className="h-3 w-3 mr-1" />
                거절
              </Button>
            </div>
          );
        }
        return <span className="text-sm text-gray-400">-</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 - 브레드크럼 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          포인트 교환 내역 조회
        </h1>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <span>포인트 지급 및 교환 내역</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-cyan-400">포인트 교환 내역 조회</span>
        </div>
      </div>

      {/* 조회 필터 카드 */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">조회</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 교환 날짜 행 */}
          <div className="flex flex-wrap items-center gap-4">
            <Label className="w-24 text-sm text-gray-600 dark:text-gray-400 shrink-0">
              교환 날짜
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-32 dark:bg-zinc-800 dark:border-zinc-700 pr-8"
                  placeholder="YYYY.MM.DD"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative">
                <Input
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-32 dark:bg-zinc-800 dark:border-zinc-700 pr-8"
                  placeholder="YYYY.MM.DD"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDatePreset("all")}
                className={`px-3 dark:border-zinc-700 ${
                  datePreset === "all"
                    ? "bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-500 hover:text-white"
                    : "dark:bg-zinc-800"
                }`}
              >
                전체
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDatePreset("today")}
                className={`px-3 dark:border-zinc-700 ${
                  datePreset === "today"
                    ? "bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-500 hover:text-white"
                    : "dark:bg-zinc-800"
                }`}
              >
                오늘
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDatePreset("week")}
                className={`px-3 dark:border-zinc-700 ${
                  datePreset === "week"
                    ? "bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-500 hover:text-white"
                    : "dark:bg-zinc-800"
                }`}
              >
                1주일
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDatePreset("month")}
                className={`px-3 dark:border-zinc-700 ${
                  datePreset === "month"
                    ? "bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-500 hover:text-white"
                    : "dark:bg-zinc-800"
                }`}
              >
                1개월
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDatePreset("custom")}
                className={`px-3 dark:border-zinc-700 ${
                  datePreset === "custom"
                    ? "bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-500 hover:text-white"
                    : "dark:bg-zinc-800"
                }`}
              >
                사용자설정
              </Button>
            </div>
          </div>

          {/* 교환 포인트량, 회원 이름 행 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label className="w-24 text-sm text-gray-600 dark:text-gray-400 shrink-0">
                교환 포인트량
              </Label>
              <Select
                value={pointAmountFilter}
                onValueChange={setPointAmountFilter}
              >
                <SelectTrigger className="flex-1 dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="1000">1,000 이상</SelectItem>
                  <SelectItem value="5000">5,000 이상</SelectItem>
                  <SelectItem value="10000">10,000 이상</SelectItem>
                  <SelectItem value="30000">30,000 이상</SelectItem>
                  <SelectItem value="50000">50,000 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-24 text-sm text-gray-600 dark:text-gray-400 shrink-0">
                회원 이름
              </Label>
              <Input
                placeholder="회원 이름으로 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* 지급 상태 행 */}
          <div className="flex items-center gap-4">
            <Label className="w-24 text-sm text-gray-600 dark:text-gray-400 shrink-0">
              지급 상태
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-64 dark:bg-zinc-800 dark:border-zinc-700">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="COMPLETED">교환 완료</SelectItem>
                <SelectItem value="PENDING">검토 필요</SelectItem>
                <SelectItem value="REJECTED">거절</SelectItem>
                <SelectItem value="FAILED">교환 실패</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 버튼 행 */}
          <div className="flex justify-between items-center pt-2">
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
                {pagination.total?.toLocaleString()}
              </span>
            </span>
          </div>
          <Select defaultValue="exchangedAt" onValueChange={handleSortChange}>
            <SelectTrigger className="w-40 dark:bg-zinc-800 dark:border-zinc-700 text-sm">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
              <SelectItem value="exchangedAt">교환 날짜: 최신 순</SelectItem>
              <SelectItem value="exchangedAtAsc">
                교환 날짜: 오래된 순
              </SelectItem>
              <SelectItem value="points">포인트: 높은 순</SelectItem>
              <SelectItem value="pointsAsc">포인트: 낮은 순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 테이블 */}
        <div className="rounded-lg border dark:border-zinc-800 overflow-hidden">
          <DataTable columns={columns} data={history} />
        </div>

        <DataTablePaginationPrefixed
          request={request}
          total={pagination.total}
        />
      </div>

      {/* 승인 확인 모달 */}
      <Sheet open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <SheetContent side="right" className="dark:bg-zinc-900">
          <SheetHeader>
            <SheetTitle>교환 요청 승인</SheetTitle>
            <SheetDescription>
              이 교환 요청을 승인하시겠습니까?
            </SheetDescription>
          </SheetHeader>
          {selectedExchange && (
            <div className="py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">회원</Label>
                  <p className="font-medium">{selectedExchange.userName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">이메일</Label>
                  <p className="font-medium">{selectedExchange.userEmail}</p>
                </div>
                <div>
                  <Label className="text-gray-500">교환 포인트</Label>
                  <p className="font-medium">
                    {selectedExchange.points?.toLocaleString()} P
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">받을 코인</Label>
                  <p className="font-medium">
                    {selectedExchange.coinAmount?.toLocaleString()}{" "}
                    {selectedExchange.coinSymbol}
                  </p>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-yellow-500">
                  ⚠️ 승인 시 사용자의 포인트가 차감됩니다.
                </p>
              </div>
            </div>
          )}
          <SheetFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsApproveModalOpen(false)}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                "승인"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 거절 모달 */}
      <Sheet open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <SheetContent side="right" className="dark:bg-zinc-900">
          <SheetHeader>
            <SheetTitle>교환 요청 거절</SheetTitle>
            <SheetDescription>거절 사유를 입력해주세요.</SheetDescription>
          </SheetHeader>
          {selectedExchange && (
            <div className="py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">회원</Label>
                  <p className="font-medium">{selectedExchange.userName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">교환 포인트</Label>
                  <p className="font-medium">
                    {selectedExchange.points?.toLocaleString()} P
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rejectReason">거절 사유 *</Label>
                <Textarea
                  id="rejectReason"
                  placeholder="거절 사유를 입력해주세요..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="dark:bg-zinc-800 dark:border-zinc-700"
                  rows={4}
                />
              </div>
            </div>
          )}
          <SheetFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason("");
              }}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleReject}
              disabled={isProcessing || !rejectReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                "거절"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
