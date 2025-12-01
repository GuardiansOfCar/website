"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";
import { ChevronRight, Calendar, Gift, Search, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

// 지급 상태 라벨
const grantStatusLabels: Record<string, { label: string; className: string }> =
  {
    COMPLETED: { label: "지급 완료", className: "text-emerald-500" },
    PENDING: { label: "검토 요청", className: "text-yellow-500" },
    REJECTED: { label: "거절 (GPS 조작)", className: "text-red-500" },
    FAILED: { label: "지급 실패", className: "text-red-500" },
  };

// 지급 사유 라벨 (ChangeReason enum 기반)
const grantReasonLabels: Record<string, string> = {
  WITHDRAW: "출금",
  ATTENDANCE: "출석 미션",
  MOVING_EARN: "이동 적립",
  EXCHANGE_POINTS: "포인트 교환",
  REFERRAL: "리퍼럴",
  INVITE_FRIEND: "친구 초대",
  COUPON: "쿠폰",
  GIFT: "관리자 지급",
  ADMIN_CANCEL: "관리자 취소",
  EVENT: "이벤트",
  MANUAL: "수동 지급",
};

// 날짜 범위 프리셋
type DatePreset = "all" | "today" | "week" | "month" | "custom";

export default function PointGrantHistoryPage() {
  const fetch = useAdminFetch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 검색 필터 상태
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  // 수동 지급 모달 상태
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userSearchText, setUserSearchText] = useState("");
  const [userSearchPage, setUserSearchPage] = useState(1);
  const [grantForm, setGrantForm] = useState({
    points: 0,
    reason: "",
  });

  // 페이지네이션
  const request = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      sort: string;
      search?: string;
      reason?: string;
      status?: string;
      start_date?: string;
      end_date?: string;
    } = {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      sort: searchParams.get("sort") || "grantedAt",
    };

    const search = searchParams.get("search");
    const reason = searchParams.get("reason");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (search) params.search = search;
    if (reason) params.reason = reason;
    if (status) params.status = status;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return params;
  }, [searchParams]);

  // 포인트 지급 내역 조회
  const { data: historyData, isLoading } = useSWR(
    ["/admin-point/grant-history", request],
    (args) => fetch(args[0], { query: args[1] })
  );

  // 회원 목록 조회 (모달용)
  const userRequest = useMemo(
    () => ({
      page: userSearchPage,
      limit: 10,
      search: userSearchText,
      provider: "ALL",
      is_active: "ALL",
    }),
    [userSearchPage, userSearchText]
  );

  const { data: usersData } = useSWR(
    isGrantModalOpen ? ["/admin-members/members/user", userRequest] : null,
    (args) => fetch(args[0], { query: args[1] })
  );

  const users = usersData?.data || [];
  const userTotal = usersData?.total || 0;

  const history = historyData?.data || [];
  const pagination = historyData?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
  };

  const handleDatePreset = (preset: DatePreset) => {
    setDatePreset(preset);
    const today = new Date();

    switch (preset) {
      case "all":
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
    const params = new URLSearchParams();
    if (searchText) params.set("search", searchText);
    params.set("page", "1");
    if (reasonFilter !== "all") {
      params.set("reason", reasonFilter);
    }
    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }
    if (startDate) {
      params.set("startDate", startDate.replace(/\./g, "-"));
    }
    if (endDate) {
      params.set("endDate", endDate.replace(/\./g, "-"));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setDatePreset("all");
    setStartDate("");
    setEndDate("");
    setReasonFilter("all");
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

  // 수동 지급 관련 핸들러
  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user: any) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSearch = () => {
    setUserSearchPage(1);
  };

  const handleGrant = async () => {
    if (selectedUsers.length === 0) {
      alert("포인트를 지급할 회원을 선택해주세요.");
      return;
    }
    if (grantForm.points <= 0) {
      alert("지급할 포인트를 입력해주세요.");
      return;
    }
    if (!grantForm.reason.trim()) {
      alert("지급 사유를 입력해주세요.");
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedUsers.length}명의 회원에게 ${grantForm.points.toLocaleString()}P를 지급하시겠습니까?`
      )
    )
      return;

    setIsSubmitting(true);
    try {
      await fetch("/admin-point/grant", {
        method: "POST",
        data: {
          userIds: selectedUsers,
          points: grantForm.points,
          reason: grantForm.reason,
        },
      });
      alert("포인트가 지급되었습니다.");
      setIsGrantModalOpen(false);
      setSelectedUsers([]);
      setGrantForm({ points: 0, reason: "" });
      // 목록 새로고침
      mutate(["/admin-point/grant-history", request]);
    } catch (error) {
      alert("포인트 지급 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 내 회원 테이블 컬럼
  const userColumns = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={users.length > 0 && selectedUsers.length === users.length}
          onCheckedChange={handleSelectAllUsers}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={selectedUsers.includes(row.original.id)}
          onCheckedChange={(checked) =>
            handleSelectUser(row.original.id, checked as boolean)
          }
        />
      ),
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "email",
      header: "이메일",
    },
    {
      accessorKey: "nickname",
      header: "닉네임",
    },
  ];
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
      accessorKey: "grantedAt",
      header: "지급 날짜",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.original.grantedAt
            ? new Date(row.original.grantedAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "reason",
      header: "지급 사유",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {grantReasonLabels[row.original.reason] || row.original.reason || "-"}
        </span>
      ),
    },
    {
      accessorKey: "points",
      header: "지급 포인트",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.original.points?.toLocaleString() || "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "지급 상태",
      cell: ({ row }: any) => {
        const status = row.original.status || "COMPLETED";
        const statusInfo = grantStatusLabels[status] || {
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
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 - 브레드크럼 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          포인트 지급 내역 조회
        </h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsGrantModalOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Gift className="h-4 w-4 mr-2" />
            포인트 수동 지급
          </Button>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <span>포인트 지급 및 교환 내역</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-cyan-400">포인트 지급 내역 조회</span>
          </div>
        </div>
      </div>

      {/* 조회 필터 카드 */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">조회</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 지급 날짜 행 */}
          <div className="flex flex-wrap items-center gap-4">
            <Label className="w-20 text-sm text-gray-600 dark:text-gray-400 shrink-0">
              지급 날짜
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
                    ? "bg-cyan-500 text-white border-cyan-500"
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
                    ? "bg-cyan-500 text-white border-cyan-500"
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
                    ? "bg-cyan-500 text-white border-cyan-500"
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
                    ? "bg-cyan-500 text-white border-cyan-500"
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
                    ? "bg-cyan-500 text-white border-cyan-500"
                    : "dark:bg-zinc-800"
                }`}
              >
                사용자설정
              </Button>
            </div>
          </div>

          {/* 지급 사유, 상태 행 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label className="w-20 text-sm text-gray-600 dark:text-gray-400 shrink-0">
                지급 사유
              </Label>
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger className="flex-1 dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="GIFT">관리자 지급</SelectItem>
                  <SelectItem value="MOVING_EARN">이동 적립</SelectItem>
                  <SelectItem value="ATTENDANCE">출석 미션</SelectItem>
                  <SelectItem value="INVITE_FRIEND">친구 초대</SelectItem>
                  <SelectItem value="REFERRAL">리퍼럴</SelectItem>
                  <SelectItem value="COUPON">쿠폰</SelectItem>
                  <SelectItem value="EXCHANGE_POINTS">포인트 교환</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-20 text-sm text-gray-600 dark:text-gray-400 shrink-0">
                지급 상태
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1 dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="COMPLETED">지급 완료</SelectItem>
                  <SelectItem value="PENDING">검토 요청</SelectItem>
                  <SelectItem value="REJECTED">거절</SelectItem>
                  <SelectItem value="FAILED">지급 실패</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 회원 이름 검색 행 */}
          <div className="flex items-center gap-4">
            <Label className="w-20 text-sm text-gray-600 dark:text-gray-400 shrink-0">
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
                {pagination.total?.toLocaleString()}
              </span>
            </span>
          </div>
          <Select defaultValue="grantedAt" onValueChange={handleSortChange}>
            <SelectTrigger className="w-40 dark:bg-zinc-800 dark:border-zinc-700 text-sm">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
              <SelectItem value="grantedAt">지급 날짜: 최신 순</SelectItem>
              <SelectItem value="grantedAtAsc">지급 날짜: 오래된 순</SelectItem>
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

      {/* 포인트 수동 지급 Sheet */}
      <Sheet open={isGrantModalOpen} onOpenChange={setIsGrantModalOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto dark:bg-zinc-900 dark:border-zinc-800">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              포인트 수동 지급
            </SheetTitle>
            <SheetDescription>
              회원을 선택하고 지급할 포인트와 사유를 입력하세요.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* 회원 목록 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium">회원 선택</Label>
                <span className="text-sm text-gray-500">
                  선택됨: {selectedUsers.length}명
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="이메일, 닉네임으로 검색"
                  value={userSearchText}
                  onChange={(e) => setUserSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUserSearch()}
                  className="flex-1 dark:bg-zinc-800 dark:border-zinc-700"
                />
                <Button
                  onClick={handleUserSearch}
                  variant="outline"
                  className="dark:bg-zinc-800 dark:border-zinc-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="border dark:border-zinc-800 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <DataTable columns={userColumns} data={users} />
              </div>
              {userTotal > 10 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={userSearchPage <= 1}
                    onClick={() => setUserSearchPage((p) => p - 1)}
                    className="dark:bg-zinc-800 dark:border-zinc-700"
                  >
                    이전
                  </Button>
                  <span className="text-sm py-2">
                    {userSearchPage} / {Math.ceil(userTotal / 10)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={userSearchPage >= Math.ceil(userTotal / 10)}
                    onClick={() => setUserSearchPage((p) => p + 1)}
                    className="dark:bg-zinc-800 dark:border-zinc-700"
                  >
                    다음
                  </Button>
                </div>
              )}
            </div>

            {/* 포인트 지급 폼 */}
            <div className="space-y-4">
              <Label className="font-medium">지급 정보</Label>
              <div className="space-y-4 p-4 border dark:border-zinc-800 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="points">지급 포인트</Label>
                  <Input
                    id="points"
                    type="number"
                    value={grantForm.points}
                    onChange={(e) =>
                      setGrantForm((prev) => ({
                        ...prev,
                        points: Number(e.target.value),
                      }))
                    }
                    min={0}
                    placeholder="지급할 포인트 입력"
                    className="dark:bg-zinc-800 dark:border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">지급 사유</Label>
                  <Textarea
                    id="reason"
                    value={grantForm.reason}
                    onChange={(e) =>
                      setGrantForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    placeholder="포인트 지급 사유를 입력하세요"
                    rows={3}
                    className="dark:bg-zinc-800 dark:border-zinc-700"
                  />
                </div>

                {selectedUsers.length > 0 && grantForm.points > 0 && (
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg text-sm">
                    <p className="font-medium text-cyan-700 dark:text-cyan-300">
                      지급 예정
                    </p>
                    <p className="text-cyan-600 dark:text-cyan-400">
                      {selectedUsers.length}명 ×{" "}
                      {grantForm.points.toLocaleString()}P ={" "}
                      <span className="font-bold">
                        {(
                          selectedUsers.length * grantForm.points
                        ).toLocaleString()}
                        P
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsGrantModalOpen(false);
                setSelectedUsers([]);
                setGrantForm({ points: 0, reason: "" });
              }}
              className="dark:bg-zinc-700 dark:border-zinc-600"
            >
              취소
            </Button>
            <Button
              onClick={handleGrant}
              disabled={
                isSubmitting ||
                selectedUsers.length === 0 ||
                grantForm.points <= 0 ||
                !grantForm.reason.trim()
              }
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Gift className="h-4 w-4 mr-2" />
              {isSubmitting ? "지급 중..." : "포인트 지급"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
