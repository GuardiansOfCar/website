"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { stringify } from "querystring";

import { defaultPaginationRequest } from "@/app/admin/(dashboard)/lib/api";
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
import { DataTable } from "@/app/v2/components/data-table";
import { DataTablePagination } from "@/app/v2/components/data-table-pagination";
import { Edit } from "lucide-react";

export default function AdminUsersListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터를 기반으로 API 요청 객체 생성
  const request = useMemo(
    () => ({
      ...defaultPaginationRequest,
      provider: null,
      is_active: "ALL",
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams]
  );

  // 검색 필드 상태 관리
  const [userName, setUserName] = useState(request.search || "");
  const [userProvider, setUserProvider] = useState(request.provider || "ALL");
  const [userStatus, setUserStatus] = useState(request.is_active || "ALL");

  const fetch = useAdminFetch();

  // 사용자 목록 데이터 요청
  const { data: listData, isLoading } = useSWR(
    [`/v1/admin-members/members/user`, request],
    (args) => fetch(args[0], { query: args[1] })
  );

  // 검색 기능 핸들러
  const handleSearch = () => {
    const params = {
      ...request,
      page: 1, // 검색 시 첫 페이지로 이동
      search: userName,
      provider: userProvider === "ALL" ? "ALL" : userProvider,
      is_active: userStatus === "ALL" ? "ALL" : userStatus,
    };
    router.push(`${pathname}?${stringify(params)}`);
  };

  // 초기화 기능 핸들러
  const handleReset = () => {
    setUserName("");
    setUserProvider("ALL");
    setUserStatus("ALL");
    router.push(pathname);
  };

  return (
    <main className={"mx-auto p-10 flex flex-col w-full space-y-6"}>
      <div>
        <p className="text-sm text-muted-foreground">회원 &gt; 회원 조회</p>
        <h1 className={"text-2xl font-bold"}>조회</h1>
      </div>
      <Separator />

      {/* 검색 필터 섹션 */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <span className="w-24 font-semibold">로그인 제공자</span>
            <Select value={userProvider} onValueChange={setUserProvider}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="제공자 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="email">이메일</SelectItem>
                <SelectItem value="google">구글</SelectItem>
                <SelectItem value="apple">애플</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-24 font-semibold">활성화 상태</span>
            <Select value={userStatus} onValueChange={setUserStatus}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-24 font-semibold">검색</span>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="사용자 이름으로 검색"
              className="flex-1"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
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
        columns={[
          {
            accessorKey: "id",
            header: "ID",
          },
          {
            accessorKey: "nickname",
            header: "사용자 이름",
          },
          {
            accessorKey: "email",
            header: "이메일",
          },
          {
            accessorKey: "provider",
            header: "로그인 제공자",
          },
          {
            accessorKey: "is_active",
            header: "활성화 상태",
            cell: ({ row }) => {
              const isActive = row.getValue("is_active");
              return isActive ? "활성" : "비활성";
            },
          },
          {
            accessorKey: "created_at",
            header: "가입일",
            cell: ({ row }) => {
              const date = new Date(row.getValue("created_at"));
              return date.toLocaleDateString("ko-KR");
            },
          },
          {
            id: "edit",
            header: "수정",
            cell: ({ row }) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  router.push(`/admin/members/users/${row.original.id}`);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            ),
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
