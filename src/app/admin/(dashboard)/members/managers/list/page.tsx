"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { stringify } from "querystring";

import { defaultPaginationRequest } from "@/app/admin/(dashboard)/lib/api";
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
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Edit } from "lucide-react";

export default function AdminManagersListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터를 기반으로 API 요청 객체 생성
  const request = useMemo(
    () => ({
      ...defaultPaginationRequest,
      role: null,
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams],
  );

  // 검색 필드 상태 관리
  const [adminName, setAdminName] = useState(request.search || "");
  const [adminRole, setAdminRole] = useState(request.role || "ALL");

  const fetch = useAdminFetch();

  // 관리자 목록 데이터 요청
  const { data: listData, isLoading } = useSWR(
    [`/v1/admin-members/members/manager`, request],
    (args) => fetch(args[0], { query: args[1] }),
  );

  // 검색 기능 핸들러
  const handleSearch = () => {
    const params = {
      ...request,
      page: 1, // 검색 시 첫 페이지로 이동
      search: adminName,
      role: adminRole === "ALL" ? null : adminRole,
    };

    console.log(params);
    router.push(`${pathname}?${stringify(params)}`);
  };

  // 초기화 기능 핸들러
  const handleReset = () => {
    setAdminName("");
    setAdminRole("ALL");
    router.push(pathname);
  };

  return (
    <main className={"mx-auto p-10 flex flex-col w-full space-y-6"}>
      <div>
        <p className="text-sm text-muted-foreground">관리자 &gt; 관리자 조회</p>
        <h1 className={"text-2xl font-bold"}>조회</h1>
      </div>
      <Separator />

      {/* 검색 필터 섹션 */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <span className="w-24 font-semibold">관리자 역할</span>
            <Select value={adminRole} onValueChange={setAdminRole}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="admin">일반관리자</SelectItem>
                <SelectItem value="subadmin">서브관리자</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-24 font-semibold">검색</span>
            <Input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="관리자 이름으로 검색"
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
            accessorKey: "role",
            header: "관리자 역할",
          },
          {
            accessorKey: "nickname",
            header: "관리자 이름",
          },
          {
            accessorKey: "email",
            header: "관리자 이메일",
          },
          {
            accessorKey: "created_at",
            header: "생성일",
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
                  router.push(`/admin/members/managers/${row.original.id}`);
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