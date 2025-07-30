"use client";

import * as React from "react";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { stringify } from "querystring";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, Edit } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils"; // shadcn/ui 유틸리티
import {
  defaultDrivingHistoryRequest,
  DrivingHistoryListRequest,
} from "@/app/admin/(dashboard)/lib/api";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // shadcn/ui 캘린더 컴포넌트
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";

// 주행 데이터 조회 페이지 컴포넌트
export default function DrivingHistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 파라미터를 기반으로 API 요청 객체 생성
  const request = useMemo(
    () => ({
      ...defaultDrivingHistoryRequest,
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams],
  );

  // 필터 상태 관리
  const [date, setDate] = useState<DateRange | undefined>({
    from: request.startDate ? dayjs(request.startDate).toDate() : undefined,
    to: request.endDate ? dayjs(request.endDate).toDate() : undefined,
  });
  const [drivingTime, setDrivingTime] = useState(request.time || "ALL");
  const [dayOfWeek, setDayOfWeek] = useState(request.day || "ALL");
  const [drivingType, setDrivingType] = useState(request.type || "ALL");
  const [memberName, setMemberName] = useState(request.name || "");
  const [sortBy, setSortBy] = useState(request.sort || "LATEST");

  const fetch = useAdminFetch();

  // 주행 기록 데이터 요청
  const { data: listData, isLoading } = useSWR(
    [`/v1/driving-history/list`, request], // API 엔드포인트는 실제 환경에 맞게 수정
    (args) => fetch(args[0], { query: args[1] }),
  );

  // 검색 핸들러
  const handleSearch = () => {
    const params = {
      ...request,
      page: 1,
      startDate: date?.from ? dayjs(date.from).format("YYYY-MM-DD") : undefined,
      endDate: date?.to ? dayjs(date.to).format("YYYY-MM-DD") : undefined,
      time: drivingTime === "ALL" ? undefined : drivingTime,
      day: dayOfWeek === "ALL" ? undefined : dayOfWeek,
      type: drivingType === "ALL" ? undefined : drivingType,
      name: memberName || undefined,
      sort: sortBy,
    };
    router.push(`${pathname}?${stringify(params)}`);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setDate(undefined);
    setDrivingTime("ALL");
    setDayOfWeek("ALL");
    setDrivingType("ALL");
    setMemberName("");
    setSortBy("LATEST");
    router.push(pathname);
  };
  
  // 날짜 프리셋 버튼 핸들러
  const setDatePreset = (unit: 'day' | 'week' | 'month', amount: number) => {
    setDate({ from: dayjs().subtract(amount, unit).toDate(), to: new Date() });
  };

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10">
      <div>
        <p className="text-sm text-muted-foreground">주행 데이터</p>
        <h1 className="text-2xl font-bold">조회</h1>
      </div>
      <Separator />

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
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {dayjs(date.from).format("L")} - {dayjs(date.to).format("L")}
                        </>
                      ) : (
                        dayjs(date.from).format("L")
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
                 <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>전체</Button>
                 <Button variant="ghost" size="sm" onClick={() => setDate({from: new Date(), to: new Date()})}>오늘</Button>
                 <Button variant="ghost" size="sm" onClick={() => setDatePreset('week', 1)}>1주일</Button>
                 <Button variant="ghost" size="sm" onClick={() => setDatePreset('month', 1)}>1개월</Button>
              </div>
            </div>
            <div></div> {/* 그리드 레이아웃을 위한 빈 공간 */}

            {/* 주행 시간, 주행 요일 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">주행 시간</span>
              <Select value={drivingTime} onValueChange={setDrivingTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  {/* 시간 옵션 추가 */}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">주행 요일</span>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  {/* 요일 옵션 추가 */}
                </SelectContent>
              </Select>
            </div>

            {/* 주행 타입, 회원 이름 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">주행 타입</span>
              <Select value={drivingType} onValueChange={setDrivingType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  {/* 타입 옵션 추가 */}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">회원 이름</span>
              <Input
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="회원 이름으로 검색"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={handleReset}>초기화</Button>
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
          <Select value={sortBy} onValueChange={(value) => {setSortBy(value); handleSearch();}}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LATEST">날짜: 최신 순</SelectItem>
              <SelectItem value="OLDEST">날짜: 오래된 순</SelectItem>
            </SelectContent>
          </Select>
        }
        columns={[
          { accessorKey: "userName", header: "회원 이름" },
          { 
            accessorKey: "date", 
            header: "주행 날짜",
            cell: ({ row }) => dayjs(row.original.date).format("YYYY.MM.DD")
          },
          { accessorKey: "time", header: "주행 시간" },
          { accessorKey: "day", header: "주행 요일" },
          { 
            accessorKey: "distance", 
            header: "주행 거리",
            cell: ({ row }) => `${row.original.distance}Km`
          },
          { accessorKey: "mode", header: "주행모드" },
        ]}
      />

      {/* 페이지네이션 */}
      <DataTablePagination request={request as any} total={listData?.total || 0} />
    </main>
  );
}