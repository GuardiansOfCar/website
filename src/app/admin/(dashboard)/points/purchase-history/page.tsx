"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Plus, Search, Loader2, ExternalLink, Copy, Check } from "lucide-react";
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

// 상태 라벨
const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING: { label: "대기중", className: "text-yellow-400" },
  CONFIRMED: { label: "완료", className: "text-green-400" },
  FAILED: { label: "실패", className: "text-red-500" },
  EXPIRED: { label: "만료", className: "text-gray-400" },
};

export default function PointPurchaseHistoryPage() {
  const fetch = useAdminFetch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 검색 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  // 수동 생성 모달 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createForm, setCreateForm] = useState({
    user_id: "",
    point_amount: "",
    coin_amount: "",
    transaction_hash: "",
    wallet_address: "",
    admin_memo: "",
  });

  // 복사 상태
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // 페이지네이션
  const request = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      status?: string;
      user_id?: number;
      email?: string;
    } = {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    };

    const status = searchParams.get("status");
    const userId = searchParams.get("user_id");
    const email = searchParams.get("email");

    if (status && status !== "all") params.status = status;
    if (userId) params.user_id = Number(userId);
    if (email) params.email = email;

    return params;
  }, [searchParams]);

  // 포인트 구매 내역 조회
  const {
    data: purchaseData,
    isLoading,
    mutate: refreshData,
  } = useSWR(["/admin-point/purchases", request], (args) =>
    fetch(args[0], { query: args[1] }),
  );

  const purchases = purchaseData?.items || [];
  const pagination = {
    total: purchaseData?.total || 0,
    page: purchaseData?.page || 1,
    limit: purchaseData?.limit || 10,
    total_pages: purchaseData?.total_pages || 1,
  };

  // 검색 처리
  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (userIdFilter) params.set("user_id", userIdFilter);
    if (searchText) params.set("email", searchText);
    router.push(`${pathname}?${params.toString()}`);
  };

  // 필터 초기화
  const handleReset = () => {
    setStatusFilter("all");
    setSearchText("");
    setUserIdFilter("");
    router.push(pathname);
  };

  // 수동 생성 처리
  const handleCreate = async () => {
    if (
      !createForm.user_id ||
      !createForm.point_amount ||
      !createForm.coin_amount ||
      !createForm.transaction_hash ||
      !createForm.wallet_address
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await fetch("/admin-point/purchases/manual", {
        method: "POST",
        data: {
          user_id: Number(createForm.user_id),
          point_amount: Number(createForm.point_amount),
          coin_amount: Number(createForm.coin_amount),
          transaction_hash: createForm.transaction_hash,
          wallet_address: createForm.wallet_address,
          admin_memo: createForm.admin_memo || undefined,
        },
      });

      if (result?.success) {
        alert(result.message || "포인트 구매가 수동 처리되었습니다.");
        refreshData();
        setIsCreateModalOpen(false);
        setCreateForm({
          user_id: "",
          point_amount: "",
          coin_amount: "",
          transaction_hash: "",
          wallet_address: "",
          admin_memo: "",
        });
      } else {
        alert(result?.message || "처리에 실패했습니다.");
      }
    } catch (error: any) {
      alert(error?.message || "처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 트랜잭션 해시 복사
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => (
        <span className="text-gray-400">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "user_id",
      header: "사용자",
      cell: ({ row }: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.user_email}</span>
          <span className="text-xs text-gray-400">
            ID: {row.original.user_id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "coin_amount",
      header: "코인",
      cell: ({ row }: any) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.coin_amount} {row.original.coin_symbol}
          </span>
          <span className="text-xs text-gray-400">{row.original.network}</span>
        </div>
      ),
    },
    {
      accessorKey: "point_amount",
      header: "포인트",
      cell: ({ row }: any) => (
        <span className="font-medium text-green-400">
          +{row.original.point_amount.toLocaleString()}P
        </span>
      ),
    },
    {
      accessorKey: "transaction_hash",
      header: "트랜잭션",
      cell: ({ row }: any) => {
        const hash = row.original.transaction_hash;
        const isPending = hash?.startsWith("pending_");
        return (
          <div className="flex items-center gap-1">
            {isPending ? (
              <span className="text-gray-400 text-xs">대기중</span>
            ) : (
              <>
                <span className="text-xs font-mono">
                  {hash?.slice(0, 10)}...{hash?.slice(-8)}
                </span>
                <button
                  onClick={() => handleCopyHash(hash)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {copiedHash === hash ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
                <a
                  href={`https://bscscan.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }: any) => {
        const status = row.original.status;
        const statusInfo = statusLabels[status] || {
          label: status,
          className: "text-gray-400",
        };
        return (
          <span className={`font-medium ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "생성일시",
      cell: ({ row }: any) => (
        <div className="flex flex-col text-xs">
          <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
          <span className="text-gray-400">
            {new Date(row.original.created_at).toLocaleTimeString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "confirmed_at",
      header: "확인일시",
      cell: ({ row }: any) =>
        row.original.confirmed_at ? (
          <div className="flex flex-col text-xs">
            <span>
              {new Date(row.original.confirmed_at).toLocaleDateString()}
            </span>
            <span className="text-gray-400">
              {new Date(row.original.confirmed_at).toLocaleTimeString()}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">포인트 구매 내역 (C2P)</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          수동 생성
        </Button>
      </div>

      {/* 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">검색 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-2">
              <Label>상태</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="PENDING">대기중</SelectItem>
                  <SelectItem value="CONFIRMED">완료</SelectItem>
                  <SelectItem value="FAILED">실패</SelectItem>
                  <SelectItem value="EXPIRED">만료</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>사용자 ID</Label>
              <Input
                type="number"
                placeholder="사용자 ID"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="w-[120px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>이메일 검색</Label>
              <Input
                type="text"
                placeholder="이메일 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-[200px]"
              />
            </div>

            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              검색
            </Button>
            <Button variant="outline" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 테이블 */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={purchases} />
              <div className="mt-4">
                <DataTablePaginationPrefixed
                  pageCount={pagination.total_pages}
                  page={pagination.page}
                  pageSize={pagination.limit}
                  total={pagination.total}
                  onPageChange={(page) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(page));
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  onPageSizeChange={(size) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("limit", String(size));
                    params.set("page", "1");
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 수동 생성 모달 */}
      <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>C2P 수동 생성</SheetTitle>
            <SheetDescription>
              누락된 BSC 트랜잭션을 수동으로 처리합니다.
              <br />
              PointPurchase + PointHistory가 생성되고 포인트가 즉시 지급됩니다.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>사용자 ID *</Label>
                <Input
                  type="number"
                  placeholder="예: 585"
                  value={createForm.user_id}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, user_id: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>포인트 수량 *</Label>
                <Input
                  type="number"
                  placeholder="예: 1000"
                  value={createForm.point_amount}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      point_amount: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>코인 수량 (GOTCAR) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="예: 10"
                value={createForm.coin_amount}
                onChange={(e) =>
                  setCreateForm({ ...createForm, coin_amount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>트랜잭션 해시 *</Label>
              <Input
                type="text"
                placeholder="0x..."
                value={createForm.transaction_hash}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    transaction_hash: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>지갑 주소 *</Label>
              <Input
                type="text"
                placeholder="0x..."
                value={createForm.wallet_address}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    wallet_address: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>관리자 메모</Label>
              <Input
                type="text"
                placeholder="누락 트랜잭션 수동 처리"
                value={createForm.admin_memo}
                onChange={(e) =>
                  setCreateForm({ ...createForm, admin_memo: e.target.value })
                }
              />
            </div>
          </div>

          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleCreate} disabled={isProcessing}>
              {isProcessing && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              생성 및 포인트 지급
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
