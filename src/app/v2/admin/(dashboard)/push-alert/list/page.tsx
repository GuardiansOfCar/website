"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { stringify } from "querystring";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, Edit } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/app/v2/lib/utils";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/app/v2/components/ui/popover";
import { Calendar } from "@/app/v2/components/ui/calendar";
import { DataTable } from "@/app/v2/components/data-table";
import { DataTablePagination } from "@/app/v2/components/data-table-pagination";

// 알림 카테고리 옵션
const notificationCategories = [
  { value: 'ALL', label: '전체' },
  { value: 'points_earned', label: '포인트 획득' },
  { value: 'g2e_submission', label: 'G2E 제출' },
  { value: 'event_rewards', label: '이벤트 보상' },
  { value: 'points_exchange', label: '포인트 교환' },
  { value: 'news', label: 'News' },
  { value: 'updates', label: 'Updates' },
  { value: 'profile_updates', label: '프로필 변경' },
  { value: 'password_change', label: '비밀번호 변경' },
  { value: 'login_activity', label: '로그인 활동' },
];

// 발송 상태 옵션
const sendStatusOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'true', label: '발송 완료' },
  { value: 'false', label: '발송 대기' },
];

// 타겟 유형 옵션
const targetTypeOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'ALL_USERS', label: '전체 사용자' },
  { value: 'USER', label: '특정 사용자' },
];

/**
 * HTML 문자열에서 태그를 제거하고, 지정된 길이로 잘라 미리보기 텍스트를 생성합니다.
 * @param htmlString - 원본 HTML 문자열
 * @param maxLength - 표시할 최대 글자 수
 * @returns 미리보기 텍스트
 */
const createHtmlPreview = (htmlString: string, maxLength: number = 50): string => {
  if (!htmlString) return "";

  // 1. 정규표현식을 사용하여 모든 HTML 태그를 제거합니다.
  const plainText = htmlString.replace(/<[^>]*>?/gm, '');

  // 2. 텍스트 길이가 maxLength보다 길면 자르고 "..."를 붙입니다.
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + '...';
  }

  // 3. 길이가 짧으면 원본 텍스트를 그대로 반환합니다.
  return plainText;
};

// 푸시 알림 조회 페이지 컴포넌트
export default function PushAlertListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 파라미터를 기반으로 API 요청 객체 생성
  const request = useMemo(
    () => ({
      page: 1,
      limit: 10,
      startDate: undefined,
      endDate: undefined,
      category: "ALL",
      isSent: "ALL",
      targetType: "ALL",
      query: "",
      orderBy: "RECENT",
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams],
  );

  // 필터 상태 관리
  const [date, setDate] = useState<DateRange | undefined>({
    from: request.startDate ? dayjs(request.startDate).toDate() : undefined,
    to: request.endDate ? dayjs(request.endDate).toDate() : undefined,
  });
  const [category, setCategory] = useState(request.category || "ALL");
  const [isSent, setIsSent] = useState(request.isSent || "ALL");
  const [targetType, setTargetType] = useState(request.targetType || "ALL");
  const [query, setQuery] = useState(request.query || "");
  const [orderBy, setOrderBy] = useState(request.orderBy || "RECENT");

  const fetch = useAdminFetch();

  // 푸시 알림 목록 데이터 요청
  const { data: listData, isLoading } = useSWR(
    [`/v1/admin-notification/list`, request],
    (args) => fetch(args[0], { query: args[1] }),
  );

  // 검색 핸들러
  const handleSearch = () => {
    const params = {
      ...request,
      page: 1,
      startDate: date?.from ? dayjs(date.from).format("YYYY-MM-DD") : undefined,
      endDate: date?.to ? dayjs(date.to).format("YYYY-MM-DD") : undefined,
      category: category === "ALL" ? undefined : category,
      isSent: isSent === "ALL" ? undefined : isSent,
      targetType: targetType === "ALL" ? undefined : targetType,
      query: query || undefined,
      orderBy: orderBy,
    };
    
    router.push(`${pathname}?${stringify(params)}`);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setDate(undefined);
    setCategory("ALL");
    setIsSent("ALL");
    setTargetType("ALL");
    setQuery("");
    setOrderBy("RECENT");
    router.push(pathname);
  };
  
  // 날짜 프리셋 버튼 핸들러
  const setDatePreset = (unit: 'day' | 'week' | 'month', amount: number) => {
    setDate({ from: dayjs().subtract(amount, unit).toDate(), to: new Date() });
  };

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10">
      <div>
        <p className="text-sm text-muted-foreground">Push 알림 &gt; Push 알림 조회</p>
        <h1 className="text-2xl font-bold">조회</h1>
      </div>
      <Separator />

      {/* 검색 필터 섹션 */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            {/* 발송일자 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">발송일자</span>
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
                          {dayjs(date.from).format("YYYY.MM.DD")} - {dayjs(date.to).format("YYYY.MM.DD")}
                        </>
                      ) : (
                        dayjs(date.from).format("YYYY.MM.DD")
                      )
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>전체</Button>
                <Button variant="ghost" size="sm" onClick={() => setDate({from: new Date(), to: new Date()})}>오늘</Button>
                <Button variant="ghost" size="sm" onClick={() => setDatePreset('week', 1)}>1주일</Button>
                <Button variant="ghost" size="sm" onClick={() => setDatePreset('month', 1)}>1개월</Button>
              </div>
            </div>
            <div></div>

            {/* 알림 카테고리 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">알림 유형</span>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {notificationCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 발송 상태 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">발송 상태</span>
              <Select value={isSent} onValueChange={setIsSent}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sendStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 타겟 유형 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">발송 대상</span>
              <Select value={targetType} onValueChange={setTargetType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {targetTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 알림 제목/내용 검색 */}
            <div className="flex items-center space-x-2 md:col-span-2">
              <span className="w-24 shrink-0 font-semibold">검색</span>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="알림 제목 및 내용으로 검색"
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
        title="푸시 알림 목록"
        total={listData?.count_data || 0}
        data={listData?.data ?? []}
        toolbar={
          <Select value={orderBy} onValueChange={(value) => {
            setOrderBy(value as 'RECENT' | 'OLDEST');
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RECENT">날짜: 최신 순</SelectItem>
              <SelectItem value="OLDEST">날짜: 오래된 순</SelectItem>
            </SelectContent>
          </Select>
        }
        columns={[
          { accessorKey: "id", header: "ID" },
          { 
            accessorKey: "publishAt", 
            header: "발송일자",
            cell: ({ row }) => row.original.publishAt ? dayjs(row.original.publishAt).format("YYYY.MM.DD HH:mm") : "-"
          },
          { 
            accessorKey: "category", 
            header: "알림유형",
            cell: ({ row }) => {
              const category = notificationCategories.find(cat => cat.value === row.original.category);
              return category?.label || row.original.category;
            }
          },
          { 
            accessorKey: "title", 
            header: "제목",
            cell: ({ row }) => createHtmlPreview(row.original.title, 30)
          },
          { 
            accessorKey: "body", 
            header: "내용",
            cell: ({ row }) => createHtmlPreview(row.original.body, 50)
          },
          { 
            accessorKey: "targetType", 
            header: "발송 대상",
            cell: ({ row }) => {
              const targetType = targetTypeOptions.find(option => option.value === row.original.targetType);
              return targetType?.label || row.original.targetType;
            }
          },
          { 
            accessorKey: "userCount", 
            header: "대상자 수",
            cell: ({ row }) => row.original.userCount || 0
          },
          { 
            accessorKey: "isSent", 
            header: "발송 상태",
            cell: ({ row }) => row.original.isSent ? "발송 완료" : "발송 대기"
          },
          {
            id: "edit",
            header: "수정",
            cell: ({ row }) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/admin/push-alert/edit/${row.original.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            ),
          },
        ]}
      />
      <DataTablePagination request={request as any} total={listData?.count_data || 0} />
    </main>
  );
}