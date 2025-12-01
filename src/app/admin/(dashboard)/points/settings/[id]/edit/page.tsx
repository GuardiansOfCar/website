"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// ChangeReason enum 라벨
const changeReasonOptions = [
  { value: "WITHDRAW", label: "출금" },
  { value: "ATTENDANCE", label: "출석" },
  { value: "MOVING_EARN", label: "이동 적립" },
  { value: "COMMENT", label: "댓글 작성" },
  { value: "TIER_UPGRADE", label: "티어 업그레이드" },
  { value: "WRITING", label: "글 작성" },
  { value: "REGISTER", label: "회원가입" },
  { value: "LIKE", label: "좋아요" },
  { value: "INVITE_FRIEND", label: "친구 초대" },
  { value: "GIFT", label: "선물" },
  { value: "EXCHANGE_POINTS", label: "포인트 교환" },
  { value: "REFERRAL", label: "리퍼럴" },
  { value: "COUPON", label: "쿠폰" },
  { value: "REFERRED_SUBMISSIONS", label: "피추천 제출" },
  { value: "MONTHLY_MOVE_BONUS", label: "월간 이동 보너스" },
  { value: "CONSECUTIVE_BONUS_5", label: "5일 연속 보너스" },
  { value: "CONSECUTIVE_BONUS_10", label: "10일 연속 보너스" },
];

export default function PointSettingEditPage() {
  const fetch = useAdminFetch();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // 기존 데이터 조회
  const { data: settingData, isLoading } = useSWR(
    id ? [`/admin-point/settings/${id}`] : null,
    (args) => fetch(args[0])
  );

  // 폼 상태
  const [changeReason, setChangeReason] = useState<string>("");
  const [conditionName, setConditionName] = useState("");
  const [description, setDescription] = useState("");
  const [pointAmount, setPointAmount] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (settingData) {
      setChangeReason(settingData.changeReason || "");
      setConditionName(settingData.conditionName || "");
      setDescription(settingData.description || "");
      setPointAmount(String(settingData.pointAmount || 0));
      setIsActive(settingData.isActive ?? true);
    }
  }, [settingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!changeReason) {
      setError("지급 사유를 선택해주세요.");
      return;
    }
    if (!conditionName.trim()) {
      setError("조건 이름을 입력해주세요.");
      return;
    }
    if (!pointAmount || Number(pointAmount) < 0) {
      setError("지급 포인트를 올바르게 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await fetch(`/admin-point/settings/${id}`, {
        method: "PUT",
        data: {
          change_reason: changeReason,
          condition_name: conditionName.trim(),
          description: description.trim() || undefined,
          point_amount: Number(pointAmount),
          is_active: isActive,
        },
      });

      if (result?.success) {
        router.push("/admin/points/settings");
      } else {
        setError(result?.message || "수정에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err?.message || "수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 항목을 삭제하시겠습니까?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await fetch(`/admin-point/settings/${id}`, {
        method: "DELETE",
      });

      if (result?.success) {
        router.push("/admin/points/settings");
      } else {
        setError(result?.message || "삭제에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err?.message || "삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            포인트 지급 항목 수정
          </h1>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <span>포인트 지급 설정</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-cyan-400">항목 수정</span>
        </div>
      </div>

      {/* 수정 폼 */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            포인트 지급 항목 수정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 지급 사유 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                지급 사유 <span className="text-red-500">*</span>
              </Label>
              <div className="md:col-span-3">
                <Select value={changeReason} onValueChange={setChangeReason}>
                  <SelectTrigger className="w-full md:w-80 dark:bg-zinc-800 dark:border-zinc-700">
                    <SelectValue placeholder="지급 사유를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                    {changeReasonOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 조건 이름 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                조건 이름 <span className="text-red-500">*</span>
              </Label>
              <div className="md:col-span-3">
                <Input
                  value={conditionName}
                  onChange={(e) => setConditionName(e.target.value)}
                  placeholder="예: 일일 출석 보너스"
                  className="w-full md:w-80 dark:bg-zinc-800 dark:border-zinc-700"
                  maxLength={100}
                />
              </div>
            </div>

            {/* 지급 조건 설명 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                지급 조건 설명
              </Label>
              <div className="md:col-span-3">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="지급 조건에 대한 상세 설명을 입력하세요"
                  className="w-full dark:bg-zinc-800 dark:border-zinc-700 min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/500
                </p>
              </div>
            </div>

            {/* 지급 포인트 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                지급 포인트 <span className="text-red-500">*</span>
              </Label>
              <div className="md:col-span-3">
                <Input
                  type="number"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  placeholder="0"
                  className="w-full md:w-40 dark:bg-zinc-800 dark:border-zinc-700"
                  min={0}
                />
              </div>
            </div>

            {/* 활성 상태 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                활성 상태
              </Label>
              <div className="md:col-span-3 flex items-center gap-3">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="data-[state=checked]:bg-cyan-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isActive ? "활성" : "비활성"}
                </span>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex justify-between pt-4 border-t dark:border-zinc-800">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                삭제
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
