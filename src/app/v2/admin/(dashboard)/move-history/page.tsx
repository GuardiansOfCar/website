"use client";

import * as React from "react";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { stringify } from "querystring";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, Edit } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/app/v2/lib/utils"; // shadcn/ui 유틸리티
import {
  defaultDrivingHistoryRequest,
  DrivingHistoryListRequest,
} from "@/app/admin/(dashboard)/lib/api";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";

import { Separator } from "@/app/v2/components/ui/separator";
import { Card, CardContent } from "@/app/v2/components/ui/card";
import { Input } from "@/app/v2/components/ui/input";
import { Button } from "@/app/v2/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/v2/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/v2/components/ui/popover";
import { Calendar } from "@/app/v2/components/ui/calendar"; // shadcn/ui 캘린더 컴포넌트
import { DataTable } from "@/app/v2/components/data-table";
import { DataTablePagination } from "@/app/v2/components/data-table-pagination";

// 주행 데이터 조회 페이지 컴포넌트
export default function DrivingHistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 파라미터를 기반으로 API 요청 객체 생성
  const request = useMemo(() => {
    const urlParams = Object.fromEntries(searchParams.entries());
    const params: any = {
      page: parseInt(urlParams.page) || 1,
      limit: parseInt(urlParams.limit) || 50,
    };

    // undefined가 아닌 값만 추가 (서버에서 빈값은 '전체'로 처리)
    if (urlParams.start_date) params.start_date = urlParams.start_date;
    if (urlParams.end_date) params.end_date = urlParams.end_date;
    if (urlParams.active_time_minutes && parseInt(urlParams.active_time_minutes) > 0) {
      params.active_time_minutes = parseInt(urlParams.active_time_minutes);
    }
    if (urlParams.day_of_week && parseInt(urlParams.day_of_week) > 0) {
      params.day_of_week = parseInt(urlParams.day_of_week);
    }
    if (urlParams.move_method && urlParams.move_method !== "ALL") {
      params.move_method = urlParams.move_method;
    }
    if (urlParams.user_name) params.user_name = urlParams.user_name;
    if (urlParams.status && urlParams.status !== "ALL") {
      params.status = urlParams.status;
    }
    if (urlParams.sort_by) params.sort_by = urlParams.sort_by;

    return params;
  }, [searchParams]);

  // 필터 상태 관리
  const [date, setDate] = useState<DateRange | undefined>({
    from: request.start_date ? dayjs(request.start_date).toDate() : undefined,
    to: request.end_date ? dayjs(request.end_date).toDate() : undefined,
  });
  const [activeTimeMinutes, setActiveTimeMinutes] = useState(
    request.active_time_minutes || 0
  );
  const [dayOfWeek, setDayOfWeek] = useState(request.day_of_week || 0);
  const [moveMethod, setMoveMethod] = useState(request.move_method || "ALL");
  const [userName, setUserName] = useState(request.user_name || "");
  const [status, setStatus] = useState(request.status || "ALL");
  const [sortBy, setSortBy] = useState(request.sort_by || "RECENT");

  const fetch = useAdminFetch();

  // 주행 기록 데이터 요청
  const { data: listData, isLoading } = useSWR(
    [`/v1/admin-move-history/list`, request],
    (args) => fetch(args[0], { query: args[1] })
  );

  // 검색 핸들러
  const handleSearch = () => {
    const params: any = {
      page: 1,
      limit: 50,
    };

    // undefined가 아닌 값만 추가 (서버에서 빈값은 '전체'로 처리)
    if (date?.from) params.start_date = dayjs(date.from).format("YYYY-MM-DD");
    if (date?.to) params.end_date = dayjs(date.to).format("YYYY-MM-DD");
    if (activeTimeMinutes > 0) params.active_time_minutes = activeTimeMinutes;
    if (dayOfWeek > 0) params.day_of_week = dayOfWeek;
    if (moveMethod !== "ALL") params.move_method = moveMethod;
    if (userName) params.user_name = userName;
    if (status !== "ALL") params.status = status;
    if (sortBy) params.sort_by = sortBy;

    router.push(`${pathname}?${stringify(params)}`);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setDate(undefined);
    setActiveTimeMinutes(0);
    setDayOfWeek(0);
    setMoveMethod("ALL");
    setUserName("");
    setStatus("ALL");
    setSortBy("RECENT");
    router.push(pathname);
  };

  // 날짜 프리셋 버튼 핸들러
  const setDatePreset = (unit: "day" | "week" | "month", amount: number) => {
    setDate({ from: dayjs().subtract(amount, unit).toDate(), to: new Date() });
  };

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10 bg-white dark:bg-black">
      <div>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          주행 데이터
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          조회
        </h1>
      </div>
      <Separator className="border-gray-200 dark:border-gray-700" />

      {/* 검색 필터 섹션 */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            {/* 주행 날짜 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">주행 날짜</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {dayjs(date.from).format("YYYY-MM-DD")} -{" "}
                          {dayjs(date.to).format("YYYY-MM-DD")}
                        </>
                      ) : (
                        dayjs(date.from).format("YYYY-MM-DD")
                      )
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="flex items-center space-x-1">
                <Button
                  variant={!date ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDate(undefined)}
                >
                  전체
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDate({ from: new Date(), to: new Date() })}
                >
                  오늘
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDatePreset("week", 1)}
                >
                  1주일
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDatePreset("month", 1)}
                >
                  1개월
                </Button>
              </div>
            </div>
            <div></div> {/* 그리드 레이아웃을 위한 빈 공간 */}
            {/* 주행 시간, 주행 요일 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">활성 시간(분) 이하</span>
              <Input
                type="number"
                value={activeTimeMinutes || ""}
                onChange={(e) =>
                  setActiveTimeMinutes(parseInt(e.target.value) || 0)
                }
                placeholder="최소 활성 시간"
                className="w-[120px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">주행 요일</span>
              <Select
                value={dayOfWeek.toString()}
                onValueChange={(value) => setDayOfWeek(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">전체</SelectItem>
                  <SelectItem value="1">일요일</SelectItem>
                  <SelectItem value="2">월요일</SelectItem>
                  <SelectItem value="3">화요일</SelectItem>
                  <SelectItem value="4">수요일</SelectItem>
                  <SelectItem value="5">목요일</SelectItem>
                  <SelectItem value="6">금요일</SelectItem>
                  <SelectItem value="7">토요일</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 주행 방법, 회원 이름 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">주행 방법</span>
              <Select value={moveMethod} onValueChange={setMoveMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="WALK">도보</SelectItem>
                  <SelectItem value="CYCLING">자전거</SelectItem>
                  <SelectItem value="CAR">자동차</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">승인 상태</span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="Pending">대기</SelectItem>
                  <SelectItem value="Approved">승인</SelectItem>
                  <SelectItem value="Rejected">거절</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">회원 이름</span>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="회원 이름으로 검색"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={handleReset}>
              초기화
            </Button>
            <Button onClick={handleSearch}>검색</Button>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 테이블 섹션 */}
      <DataTable
        title="목록"
        total={listData?.total || 0}
        data={listData?.data ?? []}
        toolbar={
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              handleSearch();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RECENT">날짜: 최신 순</SelectItem>
              <SelectItem value="DISTANCE">거리: 긴 순</SelectItem>
              <SelectItem value="MOVE_METHOD">주행 방법 순</SelectItem>
            </SelectContent>
          </Select>
        }
        onRowClick={(row) => router.push(`/admin/move-history/${row.id}`)}
        columns={[
          { accessorKey: "id", header: "ID" },
          { accessorKey: "user_name", header: "회원 이름" },
          {
            accessorKey: "move_date",
            header: "주행 날짜",
            cell: ({ row }) =>
              dayjs(row.original.move_date).format("YYYY.MM.DD"),
          },
          {
            accessorKey: "active_time_seconds",
            header: "활성 시간",
            cell: ({ row }) =>
              `${Math.floor(row.original.active_time_seconds / 60)}분 ${row.original.active_time_seconds % 60}초`,
          },
          { accessorKey: "day_of_week", header: "주행 요일" },
          {
            accessorKey: "distance",
            header: "주행 거리",
            cell: ({ row }) => `${row.original.distance.toFixed(2)}km`,
          },
          { accessorKey: "move_method", header: "주행 방법" },
          {
            accessorKey: "status",
            header: "상태",
            cell: ({ row }) => {
              const status = row.original.status;
              const statusLabels = {
                'Pending': '대기',
                'Approved': '승인',
                'Rejected': '거절'
              };
              const statusColors = {
                'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                'Approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              };
              
              return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'}`}>
                  {statusLabels[status as keyof typeof statusLabels] || status}
                </span>
              );
            },
          },
        ]}
      />

      {/* 페이지네이션 */}
      <DataTablePagination
        request={request as any}
        total={listData?.total || 0}
      />
    </main>
  );
}
