"use client";

import { useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stringify } from "querystring";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";

export default function AdminClaimTransfer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 검색 조건
  const request = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
  };

  // 임시 데이터 (실제로는 API에서 가져옴)
  const [claimList, setClaimList] = useState<any[]>([
    {
      id: 1,
      user_wallet_id: 1,
      user_address: "0x1234...5678",
      to_address: "bnb1abc...xyz",
      amount: 1000,
      status: "PENDING",
      requested_at: new Date().toISOString(),
      user: { email: "user1@example.com" },
    },
  ]);

  const handleSearch = (text: string) => {
    router.push(
      `${pathname}?${stringify({ ...request, search: text, page: 1 })}`
    );
  };

  const handleStatusChange = (status: string) => {
    router.push(`${pathname}?${stringify({ ...request, status, page: 1 })}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            대기중
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            처리중
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            완료
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            실패
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <main
      className={"mx-auto p-10 flex flex-col w-full bg-white dark:bg-black"}
    >
      <h1 className={"text-2xl font-bold text-gray-900 dark:text-white"}>
        클레임 토큰 이체 관리
      </h1>
      <Separator className={"my-4 border-gray-200 dark:border-gray-700"} />

      <div className={"flex flex-col space-y-10"}>
        <div className={"grid grid-cols-3 gap-5"}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">대기중 이체</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {claimList.filter((item) => item.status === "PENDING").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">처리중 이체</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  claimList.filter((item) => item.status === "PROCESSING")
                    .length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료된 이체</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {claimList.filter((item) => item.status === "COMPLETED").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={"flex items-center gap-4"}>
          <Input
            type="text"
            placeholder="이메일 또는 지갑 주소 검색"
            className="max-w-xs"
            defaultValue={request.search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch((e.target as HTMLInputElement).value);
              }
            }}
          />
          <Select value={request.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="PENDING">대기중</SelectItem>
              <SelectItem value="PROCESSING">처리중</SelectItem>
              <SelectItem value="COMPLETED">완료</SelectItem>
              <SelectItem value="FAILED">실패</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <Button
              onClick={() => {
                startTransition(async () => {
                  // TODO: API 호출
                  alert(
                    `선택된 ${selectedIds.length}건에 대해 토큰 이체를 실행합니다.`
                  );
                  setSelectedIds([]);
                });
              }}
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPending
                ? "처리중..."
                : `선택한 ${selectedIds.length}건 이체 실행`}
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    claimList.length > 0 &&
                    selectedIds.length ===
                      claimList.filter((item) => item.status === "PENDING")
                        .length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedIds(
                        claimList
                          .filter((item) => item.status === "PENDING")
                          .map((item) => item.id)
                      );
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>유저 지갑 주소</TableHead>
              <TableHead>출금 주소 (BNB)</TableHead>
              <TableHead className="text-right">이체 수량</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>요청일</TableHead>
              <TableHead>완료일</TableHead>
              <TableHead>TX Hash</TableHead>
              <TableHead className="w-24">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claimList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-10">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              claimList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.status === "PENDING" && (
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds([...selectedIds, item.id]);
                          } else {
                            setSelectedIds(
                              selectedIds.filter((id) => id !== item.id)
                            );
                          }
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.user?.email || "-"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.user_address
                      ? `${item.user_address.slice(0, 6)}...${item.user_address.slice(-4)}`
                      : "-"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.to_address
                      ? `${item.to_address.slice(0, 6)}...${item.to_address.slice(-4)}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.amount?.toLocaleString()} GOT
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    {item.requested_at
                      ? dayjs(item.requested_at).format("YYYY-MM-DD HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {item.completed_at
                      ? dayjs(item.completed_at).format("YYYY-MM-DD HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.tx_hash ? (
                      <a
                        href={`https://bscscan.com/tx/${item.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {`${item.tx_hash.slice(0, 6)}...${item.tx_hash.slice(-4)}`}
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {item.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => {
                          startTransition(async () => {
                            // TODO: API 호출
                            alert(
                              `ID ${item.id}에 대해 토큰 이체를 실행합니다.`
                            );
                          });
                        }}
                        disabled={isPending}
                      >
                        이체 실행
                      </Button>
                    )}
                    {item.status === "FAILED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        onClick={() => {
                          startTransition(async () => {
                            // TODO: API 호출
                            alert(`ID ${item.id}에 대해 이체를 재시도합니다.`);
                          });
                        }}
                        disabled={isPending}
                      >
                        재시도
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
