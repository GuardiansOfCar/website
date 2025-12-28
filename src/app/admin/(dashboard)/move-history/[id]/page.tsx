"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import dayjs from "dayjs";
import { ArrowLeft, MapPin, Clock, Route, Car } from "lucide-react";
import { useState } from "react";

import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// 주행 기록 상세 데이터 타입
interface DrivingHistoryDetail {
  id: number;
  user_name: string;
  user_id: number;
  move_date: string;
  active_time_seconds: number;
  start_at: string;
  end_at: string;
  day_of_week: string;
  distance: number;
  move_method: string;
  point: number;
  point_status: string;
  path_image_url?: string;
  score: number;
  status: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

// 거절 사유 enum (서버와 동일)
enum RejectionReason {
  INACCURATE_DATA = 'INACCURATE_DATA',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  INSUFFICIENT_EVIDENCE = 'INSUFFICIENT_EVIDENCE',
  VIOLATION_OF_TERMS = 'VIOLATION_OF_TERMS',
  DUPLICATE_SUBMISSION = 'DUPLICATE_SUBMISSION',
  TECHNICAL_ERROR = 'TECHNICAL_ERROR',
  OTHER = 'OTHER',
}

// 거절 사유 한국어 매핑
const rejectionReasonLabels = {
  [RejectionReason.INACCURATE_DATA]: '부정확한 데이터',
  [RejectionReason.SUSPICIOUS_ACTIVITY]: '의심스러운 활동',
  [RejectionReason.INSUFFICIENT_EVIDENCE]: '증거 부족',
  [RejectionReason.VIOLATION_OF_TERMS]: '약관 위반',
  [RejectionReason.DUPLICATE_SUBMISSION]: '중복 제출',
  [RejectionReason.TECHNICAL_ERROR]: '기술적 오류',
  [RejectionReason.OTHER]: '기타',
};

export default function DrivingHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fetch = useAdminFetch();
  const historyId = params.id as string;

  // 지급여부 선택 상태
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 주행 기록 상세 데이터 요청
  const { data: historyData, isLoading } = useSWR(
    [`/admin-move-history/detail/${historyId}`],
    (args) => fetch(args[0])
  );

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full flex-col space-y-6 p-10">
        <div className="text-center">로딩 중...</div>
      </main>
    );
  }

  if (!historyData) {
    return (
      <main className="mx-auto flex w-full flex-col space-y-6 p-10">
        <div className="text-center">주행 기록을 찾을 수 없습니다.</div>
      </main>
    );
  }

  const history: DrivingHistoryDetail = historyData;

  // 지급여부 선택 핸들러
  const handlePaymentStatusChange = (value: string) => {
    setPaymentStatus(value);
    if (value !== "REJECT") {
      setRejectionReason("");
      setCustomReason("");
    }
  };

  // 거절 사유 선택 핸들러
  const handleRejectionReasonChange = (value: string) => {
    setRejectionReason(value);
    if (value !== "CUSTOM") {
      setCustomReason("");
    }
  };

  // 적용 핸들러
  const handleApply = async () => {
    if (!paymentStatus) {
      alert("지급여부를 선택해주세요.");
      return;
    }

    if (paymentStatus === "REJECT" && !rejectionReason) {
      alert("거절 사유를 선택해주세요.");
      return;
    }

    if (paymentStatus === "REJECT" && rejectionReason === "CUSTOM" && !customReason.trim()) {
      alert("직접입력 사유를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // API 요청 데이터 구성
      const requestData: any = {
        action: paymentStatus === "APPROVED" ? "APPROVE" : "REJECT",
      };

      // 거절인 경우 거절 사유 추가
      if (paymentStatus === "REJECT") {
        if (rejectionReason === "CUSTOM") {
          requestData.rejection_reason = null;
          requestData.custom_reason = customReason.trim();
        } else {
          requestData.rejection_reason = rejectionReason;
        }
      }

      // API 호출
      const response = await fetch(`/admin-move-history/approve/${historyId}`, {
        method: "POST",
        data: requestData,
      });

      if (response) {
        alert("지급여부가 성공적으로 변경되었습니다.");
        router.back();
      }
    } catch (error) {
      console.error("지급여부 변경 실패:", error);
      alert("지급여부 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    setPaymentStatus("");
    setRejectionReason("");
    setCustomReason("");
  };

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10 bg-white dark:bg-black">
      {/* 헤더 */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">
            주행 데이터 &gt; 데이터 상세보기
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            데이터 상세보기
          </h1>
        </div>
      </div>
      <Separator className="border-gray-200 dark:border-gray-700" />

      {/* 주행 정보 카드 */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>주행 정보</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽 열 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  회원 이름
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {history.user_name}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  주행 날짜
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {dayjs(history.move_date).format("YYYY.MM.DD")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  주행 시작 - 종료 시각
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {dayjs(history.start_at).format("YYYY/MM/DD HH:mm:ss")} - {dayjs(history.end_at).format("YYYY/MM/DD HH:mm:ss")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  주행 거리
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {(history.distance / 1000).toFixed(2)}km
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  지급 포인트
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {history.point}
                </p>
              </div>
            </div>
            
            {/* 오른쪽 열 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  회원 아이디
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {history.user_id}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  주행 시간
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {Math.floor(history.active_time_seconds / 3600).toString().padStart(2, '0')}:{Math.floor((history.active_time_seconds % 3600) / 60).toString().padStart(2, '0')}:{(history.active_time_seconds % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  주행 요일
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {history.day_of_week}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  주행 모드
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {history.move_method === 'CAR' ? '운전(오토바이)' : history.move_method}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  지급 상태
                </p>
                <div className="p-3 rounded bg-gray-100 dark:bg-gray-800">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    history.point_status === 'Approved' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : history.point_status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : history.point_status === 'Rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {history.point_status === 'Approved' ? '지급 완료' : 
                     history.point_status === 'Pending' ? '대기' : 
                     history.point_status === 'Rejected' ? '거절' : 
                     history.point_status || '알 수 없음'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주행 경로 카드 */}
      {history.path_image_url && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
              <Route className="h-5 w-5" />
              <span>주행 경로</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <img
                src={history.path_image_url}
                alt="주행 경로"
                className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지급여부 선택 카드 */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            지급여부 선택
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 지급여부 선택 */}
          <div className="flex items-center space-x-4">
            <span className="w-24 shrink-0 font-semibold text-gray-900 dark:text-white">
              지급여부
            </span>
            <Select value={paymentStatus} onValueChange={handlePaymentStatusChange}>
              <SelectTrigger className="w-[200px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="지급여부 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">승인</SelectItem>
                <SelectItem value="REJECT">거절</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 거절 사유 선택 (거절 선택 시에만 표시) */}
          {paymentStatus === "REJECT" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="w-24 shrink-0 font-semibold text-gray-900 dark:text-white">
                  거절 사유
                </span>
                <Select value={rejectionReason} onValueChange={handleRejectionReasonChange}>
                  <SelectTrigger className="w-[200px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="거절 사유 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(rejectionReasonLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    <SelectItem value="CUSTOM">직접입력</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 직접입력 선택 시 텍스트 입력 필드 */}
              {rejectionReason === "CUSTOM" && (
                <div className="space-y-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    직접입력 사유
                  </span>
                  <Textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="거절 사유를 직접 입력해주세요."
                    className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              취소
            </Button>
            <Button
              onClick={handleApply}
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting ? "처리 중..." : "적용"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
        >
          목록으로 돌아가기
        </Button>
      </div>
    </main>
  );
}
