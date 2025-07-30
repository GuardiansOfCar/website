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
  // SWR을 사용해 포인트 지급 내역을 불러옵니다.
  const { data: listData, isLoading } = useSWR(`/v1/users/${userId}/points/payment`, (url) => fetch(url));

  return (
    <div className="py-4">
      <DataTable
        data={listData?.data ?? []}
        total={listData?.total || 0}
        columns={[
          // 포인트 지급 내역에 맞는 컬럼 정의
          { accessorKey: "date", header: "지급일" },
          { accessorKey: "amount", header: "지급 포인트" },
          { accessorKey: "reason", header: "지급 사유" },
        ]}
      />
      {/* 필요 시 페이지네이션 추가 */}
    </div>
  );
}

// ====================================================================
// 주행 기록 테이블 (서브 컴포넌트)
// ====================================================================
function DrivingHistory({ userId }: { userId: string }) {
  const fetch = useAdminFetch();
  // SWR을 사용해 주행 기록을 불러옵니다.
  const { data: listData, isLoading } = useSWR(`/v1/users/${userId}/driving-history`, (url) => fetch(url));
  return (
     <div className="py-4">
       <DataTable
        data={listData?.data ?? []}
        total={listData?.total || 0}
        columns={[
          // 주행 기록에 맞는 컬럼 정의
          { accessorKey: "date", header: "주행 날짜" },
          { accessorKey: "distance", header: "주행 거리" },
          { accessorKey: "mode", header: "주행 모드" },
        ]}
      />
       {/* 필요 시 페이지네이션 추가 */}
     </div>
  )
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
  
  // 섹션 표시 상태
  const [showPointsPayment, setShowPointsPayment] = useState(false);
  const [showPointsExchange, setShowPointsExchange] = useState(false);
  const [showDrivingHistory, setShowDrivingHistory] = useState(false);

  // SWR로 기본 회원 정보 불러오기
  const { data: memberData, isLoading } = useSWR(id ? `/v1/admin-members/members/user/${id}` : null, (url) => fetch(url));

  // 데이터 로딩 완료 시 계정 상태 업데이트
  useEffect(() => {
    if (memberData) {
      setAccountStatus(memberData.is_active ? "active" : "inactive");
    }
  }, [memberData]);

  // 계정 상태 변경 핸들러
  const handleStatusUpdate = async () => {
    try {
      await fetch(`/v1/admin-members/members/user/${id}`, {
        method: 'PATCH',
        data: { 
          user_id: parseInt(id),
          is_active: accountStatus === "active" 
        }
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
        <p className="text-sm text-muted-foreground">회원 &gt; 회원 조회 &gt; 회원 정보 조회</p>
        <h1 className="text-2xl font-bold">회원 정보 조회</h1>
      </div>
      
      {/* 기본 정보 */}
      <Card>
        <CardHeader><CardTitle>회원 정보</CardTitle></CardHeader>
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
              <Input value={dayjs(memberData?.created_at).format("YYYY.MM.DD") || ""} disabled />
            </div>
          </div>
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
            <div>포인트 교환 내역 테이블이 여기에 표시됩니다.</div>
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
        <CardHeader><CardTitle>계정 상태</CardTitle></CardHeader>
        <CardContent className="flex items-end space-x-4">
          <div className="flex-1 space-y-2">
            <Label>상태</Label>
            <Select value={accountStatus} onValueChange={setAccountStatus}>
              <SelectTrigger><SelectValue/></SelectTrigger>
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
        <Button variant="outline" size="lg" className="w-full md:w-1/4" onClick={() => router.back()}>
          뒤로
        </Button>
      </div>
    </main>
  );
}