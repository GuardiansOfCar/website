"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronRight, ArrowLeft, Loader2, Pencil } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

// ChangeReason enum 라벨
const changeReasonLabels: Record<string, string> = {
  WITHDRAW: "출금",
  ATTENDANCE: "출석",
  MOVING_EARN: "이동 적립",
  COMMENT: "댓글 작성",
  TIER_UPGRADE: "티어 업그레이드",
  WRITING: "글 작성",
  REGISTER: "회원가입",
  LIKE: "좋아요",
  INVITE_FRIEND: "친구 초대",
  GIFT: "선물",
  EXCHANGE_POINTS: "포인트 교환",
  REFERRAL: "리퍼럴",
  COUPON: "쿠폰",
  REFERRED_SUBMISSIONS: "피추천 제출",
  MONTHLY_MOVE_BONUS: "월간 이동 보너스",
  CONSECUTIVE_BONUS_5: "5일 연속 보너스",
  CONSECUTIVE_BONUS_10: "10일 연속 보너스",
};

export default function PointSettingDetailPage() {
  const fetch = useAdminFetch();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // 상세 데이터 조회
  const { data: settingData, isLoading, error } = useSWR(
    id ? [`/admin-point/settings/${id}`] : null,
    (args) => fetch(args[0])
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (error || !settingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">데이터를 불러올 수 없습니다.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* 헤더 - 브레드크럼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/points/settings")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            포인트 지급 항목 상세
          </h1>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <span>포인트 지급 설정</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-cyan-400">상세 조회</span>
        </div>
      </div>

      {/* 상세 정보 카드 */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-medium">상세 정보</CardTitle>
          <Button
            onClick={() => router.push(`/admin/points/settings/${id}/edit`)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Pencil className="h-4 w-4 mr-2" />
            수정하기
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              ID
            </Label>
            <div className="md:col-span-3">
              <span className="text-sm">{settingData.id}</span>
            </div>
          </div>

          {/* 지급 사유 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              지급 사유
            </Label>
            <div className="md:col-span-3">
              <span className="text-sm px-2 py-1 border rounded-md">
                {changeReasonLabels[settingData.changeReason] ||
                  settingData.changeReasonLabel ||
                  settingData.changeReason}
              </span>
            </div>
          </div>

          {/* 조건 이름 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              조건 이름
            </Label>
            <div className="md:col-span-3">
              <span className="text-sm font-medium">
                {settingData.conditionName || "-"}
              </span>
            </div>
          </div>

          {/* 설명 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              설명
            </Label>
            <div className="md:col-span-3">
              <p className="text-sm whitespace-pre-wrap">
                {settingData.description || "-"}
              </p>
            </div>
          </div>

          {/* 지급 포인트 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              지급 포인트
            </Label>
            <div className="md:col-span-3">
              <span className="text-lg font-bold text-cyan-400">
                {settingData.pointAmount?.toLocaleString() || 0} P
              </span>
            </div>
          </div>

          {/* 활성 상태 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              활성 상태
            </Label>
            <div className="md:col-span-3">
              <span
                className={`text-sm px-2 py-1 rounded-md text-white ${
                  settingData.isActive
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              >
                {settingData.isActive ? "활성" : "비활성"}
              </span>
            </div>
          </div>

          {/* 생성일 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              생성일
            </Label>
            <div className="md:col-span-3">
              <span className="text-sm">{formatDate(settingData.createdAt)}</span>
            </div>
          </div>

          {/* 수정일 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              수정일
            </Label>
            <div className="md:col-span-3">
              <span className="text-sm">{formatDate(settingData.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 하단 버튼 */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/points/settings")}
          className="w-32 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-600"
        >
          목록으로
        </Button>
        <Button
          onClick={() => router.push(`/admin/points/settings/${id}/edit`)}
          className="w-32 bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          수정하기
        </Button>
      </div>
    </div>
  );
}
