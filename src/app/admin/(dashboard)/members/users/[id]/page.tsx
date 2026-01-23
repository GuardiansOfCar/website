"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import dayjs from "dayjs";

import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";

// ====================================================================
// 포인트 지급 내역 테이블 (서브 컴포넌트)
// ====================================================================
function PointPaymentHistory({ userId }: { userId: string }) {
  const fetch = useAdminFetch();
  const [page, setPage] = useState(1);
  const limit = 10;

  // SWR을 사용해 포인트 지급 내역을 불러옵니다.
  const { data: listData, isLoading } = useSWR(
    `/admin-members/members/user/${userId}/points?page=${page}&limit=${limit}`,
    (url) => fetch(url)
  );

  const totalPages = Math.ceil((listData?.total || 0) / limit);

  return (
    <div className="py-4">
      <DataTable
        data={listData?.data ?? []}
        total={listData?.total || 0}
        columns={[
          // 포인트 지급 내역에 맞는 컬럼 정의
          {
            accessorKey: "date",
            header: "지급일",
            cell: ({ row }) => {
              const date = row.getValue("date");
              if (!date) return "-";
              return new Date(date as string).toLocaleString("ko-KR");
            },
          },
          {
            accessorKey: "amount",
            header: "변동 포인트",
            cell: ({ row }) => {
              const amount = row.getValue("amount") as number;
              return amount >= 0
                ? `+${amount.toLocaleString()}`
                : amount.toLocaleString();
            },
          },
          { accessorKey: "reason", header: "변동 사유" },
          {
            accessorKey: "balance",
            header: "잔액",
            cell: ({ row }) => {
              const balance = row.getValue("balance") as number;
              return balance?.toLocaleString() ?? "-";
            },
          },
        ]}
      />
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// 주행 기록 테이블 (서브 컴포넌트)
// ====================================================================
function DrivingHistory({ userId }: { userId: string }) {
  const fetch = useAdminFetch();
  const [page, setPage] = useState(1);
  const limit = 10;

  // SWR을 사용해 주행 기록을 불러옵니다.
  const { data: listData, isLoading } = useSWR(
    `/admin-members/members/user/${userId}/driving?page=${page}&limit=${limit}`,
    (url) => fetch(url)
  );

  const totalPages = Math.ceil((listData?.total || 0) / limit);

  return (
    <div className="py-4">
      <DataTable
        data={listData?.data ?? []}
        total={listData?.total || 0}
        columns={[
          // 주행 기록에 맞는 컬럼 정의
          {
            accessorKey: "date",
            header: "주행 날짜",
            cell: ({ row }) => {
              const date = row.getValue("date");
              if (!date) return "-";
              return new Date(date as string).toLocaleString("ko-KR");
            },
          },
          {
            accessorKey: "distance",
            header: "주행 거리",
            cell: ({ row }) => {
              const distance = row.getValue("distance") as number;
              if (!distance) return "-";
              return distance >= 1000
                ? `${(distance / 1000).toFixed(2)} km`
                : `${distance} m`;
            },
          },
          { accessorKey: "mode", header: "주행 모드" },
          {
            accessorKey: "duration",
            header: "주행 시간",
            cell: ({ row }) => {
              const sec = row.getValue("duration") as number;
              if (!sec) return "-";
              const min = Math.floor(sec / 60);
              const s = sec % 60;
              return `${min}분 ${s}초`;
            },
          },
          { accessorKey: "point", header: "획득 포인트" },
          { accessorKey: "score", header: "점수" },
        ]}
      />
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// 포인트 교환 내역 테이블 (서브 컴포넌트)
// ====================================================================
function PointExchangeHistory({ userId }: { userId: string }) {
  const fetch = useAdminFetch();
  const [page, setPage] = useState(1);
  const limit = 10;

  // SWR을 사용해 포인트 교환 내역을 불러옵니다.
  const { data: listData, isLoading } = useSWR(
    `/admin-members/members/user/${userId}/exchange?page=${page}&limit=${limit}`,
    (url) => fetch(url)
  );

  const totalPages = Math.ceil((listData?.total || 0) / limit);

  return (
    <div className="py-4">
      <DataTable
        data={listData?.data ?? []}
        total={listData?.total || 0}
        columns={[
          // 포인트 교환 내역에 맞는 컬럼 정의
          {
            accessorKey: "date",
            header: "교환일",
            cell: ({ row }: any) => (
              <span>
                {row.original.date
                  ? new Date(row.original.date).toLocaleDateString("ko-KR")
                  : "-"}
              </span>
            ),
          },
          {
            accessorKey: "point_amount",
            header: "교환 포인트",
            cell: ({ row }: any) => (
              <span>{row.original.point_amount?.toLocaleString() || "-"}</span>
            ),
          },
          {
            accessorKey: "coin_amount",
            header: "받은 토큰",
            cell: ({ row }: any) => (
              <span>
                {row.original.coin_amount?.toLocaleString() || "-"}{" "}
                {row.original.coin_symbol || ""}
              </span>
            ),
          },
          { accessorKey: "status", header: "상태" },
        ]}
      />
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// 메인 페이지 컴포넌트
// ====================================================================
export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fetch = useAdminFetch();

  // 계정 상태 관련 상태
  const [accountStatus, setAccountStatus] = useState("");
  const [reason, setReason] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [inviterId, setInviterId] = useState("");

  // 섹션 표시 상태
  const [showPointsPayment, setShowPointsPayment] = useState(false);
  const [showPointsExchange, setShowPointsExchange] = useState(false);
  const [showDrivingHistory, setShowDrivingHistory] = useState(false);

  // SWR로 기본 회원 정보 불러오기
  const { data: memberData, isLoading } = useSWR(
    id ? `/admin-members/members/user/${id}` : null,
    (url) => fetch(url)
  );

  // 데이터 로딩 완료 시 계정 상태 업데이트
  useEffect(() => {
    if (memberData) {
      setAccountStatus(memberData.is_active ? "active" : "inactive");
      setReferralCode(memberData.referral_code || "");
      setInviterId(memberData.inviter_id?.toString() || "");
    }
  }, [memberData]);

  // 레퍼럴 코드 변경 핸들러
  const handleReferralCodeUpdate = async () => {
    try {
      await fetch(`/admin-members/members/user/${id}`, {
        method: "PATCH",
        data: {
          user_id: parseInt(id),
          referral_code: referralCode,
        },
      });
      alert("레퍼럴 코드가 성공적으로 변경되었습니다.");
    } catch (error) {
      alert("레퍼럴 코드 변경에 실패했습니다.");
      console.error(error);
    }
  };

  // 추천인 ID 변경 핸들러
  const handleInviterIdUpdate = async () => {
    try {
      await fetch(`/admin-members/members/user/${id}`, {
        method: "PATCH",
        data: {
          user_id: parseInt(id),
          inviter_id: inviterId ? parseInt(inviterId) : null,
        },
      });
      alert("추천인 ID가 성공적으로 변경되었습니다.");
    } catch (error) {
      alert("추천인 ID 변경에 실패했습니다.");
      console.error(error);
    }
  };

  // 계정 상태 변경 핸들러
  const handleStatusUpdate = async () => {
    try {
      await fetch(`/admin-members/members/user/${id}`, {
        method: "PATCH",
        data: {
          user_id: parseInt(id),
          is_active: accountStatus === "active",
        },
      });
      alert("계정 상태가 성공적으로 변경되었습니다.");
    } catch (error) {
      alert("상태 변경에 실패했습니다.");
      console.error(error);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <main className="mx-auto flex w-full flex-col space-y-8 p-10">
      <div>
        <p className="text-sm text-muted-foreground">
          회원 &gt; 회원 조회 &gt; 회원 정보 조회
        </p>
        <h1 className="text-2xl font-bold">회원 정보 조회</h1>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>회원 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>회원 이름</Label>
              <Input value={memberData?.nickname || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input value={memberData?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>로그인 제공자</Label>
              <Input value={memberData?.provider || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>가입일자</Label>
              <Input
                value={dayjs(memberData?.created_at).format("YYYY.MM.DD") || ""}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 레퍼럴 코드 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>레퍼럴 코드</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end space-x-4">
          <div className="flex-1 space-y-2">
            <Label>레퍼럴 코드</Label>
            <Input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="레퍼럴 코드 입력"
            />
          </div>
          <Button onClick={handleReferralCodeUpdate}>변경</Button>
        </CardContent>
      </Card>

      {/* 추천인 ID 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>추천인 정보</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end space-x-4">
          <div className="flex-1 space-y-2">
            <Label>추천인 ID (User ID)</Label>
            <Input
              type="number"
              value={inviterId}
              onChange={(e) => setInviterId(e.target.value)}
              placeholder="추천인 User ID 입력"
            />
          </div>
          <Button onClick={handleInviterIdUpdate}>변경</Button>
        </CardContent>
      </Card>

      {/* 포인트 지급 내역 */}
      <Card>
        <CardHeader>
          <CardTitle
            className="cursor-pointer"
            onClick={() => setShowPointsPayment(!showPointsPayment)}
          >
            포인트 지급 내역 {showPointsPayment ? "▼" : "▶"}
          </CardTitle>
        </CardHeader>
        {showPointsPayment && (
          <CardContent>
            <PointPaymentHistory userId={id} />
          </CardContent>
        )}
      </Card>

      {/* 포인트 교환 내역 */}
      <Card>
        <CardHeader>
          <CardTitle
            className="cursor-pointer"
            onClick={() => setShowPointsExchange(!showPointsExchange)}
          >
            포인트 교환 내역 {showPointsExchange ? "▼" : "▶"}
          </CardTitle>
        </CardHeader>
        {showPointsExchange && (
          <CardContent>
            <PointExchangeHistory userId={id} />
          </CardContent>
        )}
      </Card>

      {/* 주행 기록 */}
      <Card>
        <CardHeader>
          <CardTitle
            className="cursor-pointer"
            onClick={() => setShowDrivingHistory(!showDrivingHistory)}
          >
            주행 기록 {showDrivingHistory ? "▼" : "▶"}
          </CardTitle>
        </CardHeader>
        {showDrivingHistory && (
          <CardContent>
            <DrivingHistory userId={id} />
          </CardContent>
        )}
      </Card>

      {/* 계정 상태 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>계정 상태</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end space-x-4">
          <div className="flex-1 space-y-2">
            <Label>상태</Label>
            <Select value={accountStatus} onValueChange={setAccountStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-[2] space-y-2">
            <Label>변경 사유</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button onClick={handleStatusUpdate}>변경</Button>
        </CardContent>
      </Card>

      <div className="pt-4 text-center">
        <Button
          variant="outline"
          size="lg"
          className="w-full md:w-1/4"
          onClick={() => router.back()}
        >
          뒤로
        </Button>
      </div>
    </main>
  );
}
