"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { stringify } from "querystring";
import dayjs from "dayjs";
import { Edit, Trash2 } from "lucide-react";

import { defaultCouponListRequest } from "@/app/admin/(dashboard)/lib/api";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";

export default function CouponListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const request = useMemo(
    () => ({
      ...defaultCouponListRequest,
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams],
  );

  const [search, setSearch] = useState(request.search || "");

  const fetch = useAdminFetch();

  const {
    data: listData,
    isLoading,
    mutate,
  } = useSWR([`/admin-coupon/coupon`, request], (args) =>
    fetch(args[0], { query: args[1] }),
  );

  const handleSearch = () => {
    const params = {
      ...request,
      page: 1,
      search: search || undefined,
    };
    router.push(`${pathname}?${stringify(params)}`);
  };

  const handleReset = () => {
    setSearch("");
    router.push(pathname);
  };

  const handleDelete = async (couponId: number) => {
    if (!confirm("정말 이 쿠폰을 삭제하시겠습니까?")) return;
    try {
      await fetch(`/admin-coupon/coupon/${couponId}`, { method: "DELETE" });
      alert("쿠폰이 삭제되었습니다.");
      mutate();
    } catch (error) {
      console.error("쿠폰 삭제 실패:", error);
      alert("쿠폰 삭제에 실패했습니다.");
    }
  };

  return (
    <main className="mx-auto flex w-full flex-col space-y-4 md:space-y-6 p-4 md:p-6 lg:p-10">
      <div>
        <p className="text-xs md:text-sm text-muted-foreground">
          쿠폰 관리 &gt; 쿠폰 조회
        </p>
        <h1 className="text-xl md:text-2xl font-bold">쿠폰 조회</h1>
      </div>
      <Separator />

      {/* 검색 필터 섹션 */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-x-4 md:gap-x-8 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:col-span-2">
              <span className="w-full md:w-24 shrink-0 font-semibold text-sm">
                검색
              </span>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="시리얼 번호 또는 쿠폰명으로 검색"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              초기화
            </Button>
            <Button onClick={handleSearch} className="w-full sm:w-auto">
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 생성 버튼 */}
      <div className="flex justify-end">
        <Button onClick={() => router.push("/admin/coupons/create")}>
          + 쿠폰 생성
        </Button>
      </div>

      {/* 데이터 테이블 섹션 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
          로딩 중...
        </div>
      ) : (
        <>
          <DataTable
            title="쿠폰 목록"
            total={listData?.total || 0}
            data={listData?.coupons ?? []}
            columns={[
              { accessorKey: "id", header: "ID" },
              { accessorKey: "serial_number", header: "시리얼 번호" },
              { accessorKey: "condition_name", header: "쿠폰명" },
              {
                accessorKey: "point_amount",
                header: "포인트",
                cell: ({ row }) =>
                  Number(row.original.point_amount).toLocaleString(),
              },
              {
                accessorKey: "is_used",
                header: "사용 여부",
                cell: ({ row }) => (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      row.original.is_used
                        ? "bg-gray-100 text-gray-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {row.original.is_used ? "사용됨" : "미사용"}
                  </span>
                ),
              },
              {
                accessorKey: "is_active",
                header: "활성 상태",
                cell: ({ row }) => (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      row.original.is_active
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.original.is_active ? "활성" : "비활성"}
                  </span>
                ),
              },
              {
                accessorKey: "expired_at",
                header: "만료일",
                cell: ({ row }) =>
                  dayjs(row.original.expired_at).format("YYYY.MM.DD"),
              },
              {
                accessorKey: "created_at",
                header: "생성일",
                cell: ({ row }) =>
                  dayjs(row.original.created_at).format("YYYY.MM.DD HH:mm"),
              },
              {
                id: "edit",
                header: "수정",
                cell: ({ row }) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/admin/coupons/${row.original.id}`)
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                ),
              },
              {
                id: "delete",
                header: "삭제",
                cell: ({ row }) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(row.original.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                ),
              },
            ]}
          />
          <DataTablePagination
            request={request as any}
            total={listData?.total || 0}
          />
        </>
      )}
    </main>
  );
}
