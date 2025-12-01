"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { DataTablePaginationPrefixed } from "@/components/data-table-pagination-prefixed";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type WithdrawalStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

const statusLabels: Record<
  WithdrawalStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "대기중", className: "bg-orange-100 text-orange-800" },
  PROCESSING: { label: "처리중", className: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "완료", className: "bg-green-100 text-green-800" },
  FAILED: { label: "실패", className: "bg-red-100 text-red-800" },
};

export default function AdminWithdrawal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const fetch = useAdminFetch();
  const [isProcessing, setIsProcessing] = useState(false);

  // 출금 요청 목록 페이지네이션
  const withdrawalRequest = useMemo(
    () => ({
      page: Number(searchParams.get("wPage")) || 1,
      limit: Number(searchParams.get("wLimit")) || 10,
      search: searchParams.get("wSearch") || "",
    }),
    [searchParams]
  );

  // 사용자 잔액 현황 페이지네이션
  const balanceRequest = useMemo(
    () => ({
      page: Number(searchParams.get("bPage")) || 1,
      limit: Number(searchParams.get("bLimit")) || 10,
      search: searchParams.get("bSearch") || "",
    }),
    [searchParams]
  );

  const [withdrawalSearchText, setWithdrawalSearchText] = useState(
    withdrawalRequest.search || ""
  );
  const [balanceSearchText, setBalanceSearchText] = useState(
    balanceRequest.search || ""
  );

  // 출금 요청 목록 (UserWalletBalance 기반)
  const withdrawalList = useSWR(
    [`/wallets/withdrawal/list`, withdrawalRequest],
    (args) => fetch(args[0], { query: args[1] })
  );

  // 사용자 지갑 잔액 목록 (출금 가능한 잔액)
  const balanceList = useSWR(
    [`/wallets/balance/list`, balanceRequest],
    (args) => fetch(args[0], { query: args[1] })
  );

  const withdrawalData = withdrawalList.data?.data || [];
  const balanceData = balanceList.data?.data || [];

  // 상태별 카운트
  const pendingCount = withdrawalData.filter(
    (item: any) => item.status === "PENDING"
  ).length;
  const totalPendingAmount = withdrawalData
    .filter((item: any) => item.status === "PENDING")
    .reduce((sum: number, item: any) => sum + (item.amount || 0), 0);

  // BNB 토큰 이체 실행
  const handleTransfer = async (ids: number[]) => {
    if (!confirm(`${ids.length}건의 출금을 BNB 네트워크로 이체하시겠습니까?`))
      return;

    setIsProcessing(true);
    try {
      await fetch(`/wallets/withdrawal/transfer`, {
        method: "POST",
        data: { ids },
      });
      withdrawalList.mutate();
      balanceList.mutate();
      alert("이체가 완료되었습니다.");
    } catch (error) {
      alert("이체 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return "-";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  // 출금 요청 목록 검색
  const handleWithdrawalSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("wSearch", withdrawalSearchText);
    params.set("wPage", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // 사용자 잔액 현황 검색
  const handleBalanceSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("bSearch", balanceSearchText);
    params.set("bPage", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // 출금 요청 목록 페이지네이션용 request 변환
  const withdrawalPaginationRequest = {
    page: withdrawalRequest.page,
    limit: withdrawalRequest.limit,
    search: withdrawalRequest.search,
  };

  // 사용자 잔액 현황 페이지네이션용 request 변환
  const balancePaginationRequest = {
    page: balanceRequest.page,
    limit: balanceRequest.limit,
    search: balanceRequest.search,
  };

  return (
    <main className="mx-auto p-4 md:p-6 lg:p-10 flex flex-col w-full bg-white dark:bg-black">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        출금 관리
      </h1>
      <p className="text-xs md:text-sm text-gray-500 mt-1">
        UserWalletBalance 기반 BNB 네트워크 토큰 이체
      </p>
      <Separator className="my-4 border-gray-200 dark:border-gray-700" />

      <div className="flex flex-col space-y-4 md:space-y-6">
        {/* 상단 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">출금 대기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-orange-500">
                {pendingCount}건
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">대기 금액</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">
                {totalPendingAmount.toLocaleString()} GOCAR
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                총 사용자 잔액
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">
                {balanceData
                  .reduce(
                    (sum: number, item: any) => sum + (item.balance || 0),
                    0
                  )
                  .toLocaleString()}{" "}
                GOCAR
              </div>
            </CardContent>
          </Card>
          <Card className="flex items-center justify-center">
            <CardContent className="pt-6">
              <Button
                onClick={() => {
                  const pendingIds = withdrawalData
                    .filter((item: any) => item.status === "PENDING")
                    .map((item: any) => item.id);
                  if (pendingIds.length === 0) {
                    alert("대기중인 출금 요청이 없습니다.");
                    return;
                  }
                  handleTransfer(pendingIds);
                }}
                disabled={pendingCount === 0 || isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                {isProcessing ? "처리 중..." : "전체 이체"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 출금 요청 목록 */}
        <DataTable
          title={"출금 요청 목록"}
          total={withdrawalList.data?.meta?.total || 0}
          data={withdrawalData}
          columns={[
            {
              id: "select",
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label="Select all"
                />
              ),
              cell: ({ row }) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                  />
                </div>
              ),
            },
            {
              accessorKey: "icoAddress",
              header: "지갑주소",
              cell: ({ row }) => (
                <span title={row.original.icoAddress}>
                  {truncateAddress(row.original.icoAddress)}
                </span>
              ),
            },
            { accessorKey: "amount", header: "출금 수량" },
            { accessorKey: "currentBalance", header: "현재 잔액" },
            {
              accessorKey: "createdAt",
              header: "요청일",
              cell: ({ row }) => formatDate(row.original.createdAt),
            },
            {
              accessorKey: "txHash",
              header: "TX Hash",
              cell: ({ row }) => {
                const txHash = row.original.txHash;
                if (!txHash) return "-";
                return (
                  <a
                    href={`https://bscscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {truncateAddress(txHash)}
                  </a>
                );
              },
            },
            {
              accessorKey: "status",
              header: "상태",
              cell: ({ row }) => {
                const status = row.original.status as WithdrawalStatus;
                const { label, className } = statusLabels[status] || {
                  label: status,
                  className: "bg-gray-100 text-gray-800",
                };
                return (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
                  >
                    {label}
                  </span>
                );
              },
            },
          ]}
          rowActionButtons={[
            {
              label: "선택 이체",
              onClick: async (selected: any[]) => {
                const pendingItems = selected.filter(
                  (item) => item.status === "PENDING"
                );
                if (pendingItems.length === 0) {
                  alert("대기중 상태인 항목을 선택해주세요.");
                  return;
                }
                handleTransfer(pendingItems.map((x) => x.id));
              },
            },
          ]}
          toolbar={
            <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center w-full md:w-auto">
              <Input
                value={withdrawalSearchText}
                onChange={(e) => setWithdrawalSearchText(e.target.value)}
                placeholder="지갑 주소 검색"
                className="w-full md:w-[250px] lg:w-[300px]"
                onKeyDown={(e) => e.key === "Enter" && handleWithdrawalSearch()}
              />
              <Button
                variant="default"
                className="bg-primary text-black hover:bg-primary/90 font-medium w-full md:w-auto"
                onClick={handleWithdrawalSearch}
              >
                검색
              </Button>
            </div>
          }
        />
        <DataTablePaginationPrefixed
          request={withdrawalPaginationRequest}
          total={withdrawalList.data?.meta?.total || 0}
          prefix="w"
        />

        {/* 사용자 잔액 목록 */}
        <DataTable
          title={"사용자 잔액 현황"}
          total={balanceList.data?.meta?.total || 0}
          data={balanceData}
          columns={[
            {
              accessorKey: "icoAddress",
              header: "지갑주소",
              cell: ({ row }) => (
                <span title={row.original.icoAddress}>
                  {truncateAddress(row.original.icoAddress)}
                </span>
              ),
            },
            { accessorKey: "balance", header: "총 잔액" },
            { accessorKey: "availableAmount", header: "출금 가능" },
            {
              accessorKey: "updatedAt",
              header: "최종 업데이트",
              cell: ({ row }) => formatDate(row.original.updatedAt),
            },
          ]}
          toolbar={
            <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center w-full md:w-auto">
              <Input
                value={balanceSearchText}
                onChange={(e) => setBalanceSearchText(e.target.value)}
                placeholder="지갑 주소 검색"
                className="w-full md:w-[250px] lg:w-[300px]"
                onKeyDown={(e) => e.key === "Enter" && handleBalanceSearch()}
              />
              <Button
                variant="default"
                className="bg-primary text-black hover:bg-primary/90 font-medium w-full md:w-auto"
                onClick={handleBalanceSearch}
              >
                검색
              </Button>
            </div>
          }
        />
        <DataTablePaginationPrefixed
          request={balancePaginationRequest}
          total={balanceList.data?.meta?.total || 0}
          prefix="b"
        />
      </div>
    </main>
  );
}
