"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { stringify } from "querystring";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, Edit } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { defaultNoticeListRequest, NoticeListRequest } from "@/app/admin/(dashboard)/lib/api";
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
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";

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

// 공지사항 조회 페이지 컴포넌트
export default function NoticeListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 파라미터를 기반으로 API 요청 객체 생성
  const request = useMemo(
    () => ({
      ...defaultNoticeListRequest,
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams],
  );

  // 필터 상태 관리
  const [date, setDate] = useState<DateRange | undefined>({
    from: request.start_date ? dayjs(request.start_date).toDate() : undefined,
    to: request.end_date ? dayjs(request.end_date).toDate() : undefined,
  });
  const [postType, setPostType] = useState(request.type || "ALL");
  const [importanceType, setImportanceType] = useState(request.importance_type || "ALL");
  const [query, setQuery] = useState(request.query || "");
  const [orderBy, setOrderBy] = useState(request.order_by || "RECENT");

  const fetch = useAdminFetch();

  // 공지사항 목록 데이터 요청
  const { data: listData, isLoading } = useSWR(
    [`/v1/admin-news/list`, request],
    (args) => fetch(args[0], { query: args[1] }),
  );

  // 검색 핸들러
  const handleSearch = () => {
    const params = {
      ...request,
      page: 1,
      startDate: date?.from ? dayjs(date.from).format("YYYY-MM-DD") : undefined,
      endDate: date?.to ? dayjs(date.to).format("YYYY-MM-DD") : undefined,
      type: postType === "ALL" ? undefined : postType,
      importance_type: importanceType === "ALL" ? undefined : importanceType,
      query: query || undefined,
      order_by: orderBy,
    };
    router.push(`${pathname}?${stringify(params)}`);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setDate(undefined);
    setPostType("ALL");
    setImportanceType("ALL");
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
        <p className="text-sm text-muted-foreground">공지사항 &gt; 공지사항 조회</p>
        <h1 className="text-2xl font-bold">조회</h1>
      </div>
      <Separator />

      {/* 검색 필터 섹션 */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            {/* 게시일자 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">게시일자</span>
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

            {/* 공지 유형, 노출 상태 필터 */}
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">유형</span>
              <Select value={postType} onValueChange={(value) => setPostType(value as "ALL" | "EVENT" | "ANNOUNCEMENT")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="EVENT">이벤트</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">공지</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-24 shrink-0 font-semibold">노출 상태</span>
              <Select value={importanceType} onValueChange={(value) => setImportanceType(value as "ALL" | "IMPORTANT" | "NORMAL")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="IMPORTANT">중요</SelectItem>
                  <SelectItem value="NORMAL">일반</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 공지 제목/내용 검색 */}
            <div className="flex items-center space-x-2 md:col-span-2">
              <span className="w-24 shrink-0 font-semibold">검색</span>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="공지 제목 및 내용으로 검색"
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
        title="뉴스 목록"
        total={listData?.total || 0}
        data={listData?.posts ?? []} // 'data' -> 'posts'
        toolbar={
          // ✨ 3. 정렬 Select 컴포넌트와 상태를 DTO에 맞게 수정
          <Select value={orderBy} onValueChange={(value) => {
            setOrderBy(value as 'RECENT' | 'OLDEST');
            // 정렬 변경 시 바로 검색을 실행하려면 아래 handleSearch() 호출
            handleSearch(); // 필요 시 주석 해제
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LATEST">날짜: 최신 순</SelectItem>
              <SelectItem value="RECENT">날짜: 오래된 순</SelectItem>
            </SelectContent>
          </Select>
        }
        columns={[
          { 
            accessorKey: "created_at", 
            header: "게시일자",
            cell: ({ row }) => dayjs(row.original.created_at).format("YYYY.MM.DD HH:mm")
          },
          { accessorKey: "id", header: "ID" },
          { accessorKey: "title", header: "제목" },
          { 
            accessorKey: "contents", 
            header: "내용",
            // ✨ cell 렌더링 시 createHtmlPreview 함수를 사용합니다.
            cell: ({ row }) => createHtmlPreview(row.original.contents, 50) // 50자로 제한
          },
          { accessorKey: "post_type", header: "공지 유형" },
          { 
            accessorKey: "importance", 
            header: "중요도",
            cell: ({ row }) => {
                if (row.original.importance === 1) return "중요";
                if (row.original.importance === 2) return "일반";
                return "-";
            }
          },
          {
            id: "edit",
            header: "수정",
            cell: ({ row }) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/admin/news/${row.original.id}`)} // 경로 수정
              >
                <Edit className="h-4 w-4" />
              </Button>
            ),
          },
        ]}
      />
      <DataTablePagination request={request as any} total={listData?.total || 0} />
    </main>
  );
}