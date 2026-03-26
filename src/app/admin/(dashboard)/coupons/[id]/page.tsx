"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import dayjs from "dayjs";

import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CouponDetailPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;
  const fetch = useAdminFetch();

  const { data: coupon, isLoading } = useSWR(
    couponId ? [`/admin-coupon/coupon/${couponId}`] : null,
    (args) => fetch(args[0]),
  );

  const [conditionName, setConditionName] = useState("");
  const [pointAmount, setPointAmount] = useState("");
  const [expiredAt, setExpiredAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (coupon) {
      setConditionName(coupon.condition_name || "");
      setPointAmount(String(coupon.point_amount || ""));
      setExpiredAt(
        coupon.expired_at ? dayjs(coupon.expired_at).format("YYYY-MM-DD") : "",
      );
    }
  }, [coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!conditionName.trim()) {
      alert("쿠폰명을 입력해주세요.");
      return;
    }
    if (!pointAmount || Number(pointAmount) <= 0) {
      alert("지급 포인트를 올바르게 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("/admin-coupon/coupon", {
        method: "PATCH",
        data: {
          id: Number(couponId),
          condition_name: conditionName.trim(),
          point_amount: Number(pointAmount),
          expired_at: expiredAt || undefined,
        },
      });
      alert("쿠폰이 수정되었습니다.");
      router.push("/admin/coupons/list");
    } catch (error) {
      console.error("쿠폰 수정 실패:", error);
      alert("쿠폰 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 쿠폰을 삭제하시겠습니까?")) return;
    try {
      await fetch(`/admin-coupon/coupon/${couponId}`, { method: "DELETE" });
      alert("쿠폰이 삭제되었습니다.");
      router.push("/admin/coupons/list");
    } catch (error) {
      console.error("쿠폰 삭제 실패:", error);
      alert("쿠폰 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full flex-col space-y-4 p-4 md:p-6 lg:p-10">
        <p className="text-sm text-muted-foreground">로딩 중...</p>
      </main>
    );
  }

  if (!coupon) {
    return (
      <main className="mx-auto flex w-full flex-col space-y-4 p-4 md:p-6 lg:p-10">
        <p className="text-sm text-destructive">쿠폰을 찾을 수 없습니다.</p>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/coupons/list")}
        >
          목록으로 돌아가기
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full flex-col space-y-4 md:space-y-6 p-4 md:p-6 lg:p-10">
      <div>
        <p className="text-xs md:text-sm text-muted-foreground">
          쿠폰 관리 &gt; 쿠폰 상세
        </p>
        <h1 className="text-xl md:text-2xl font-bold">쿠폰 상세 / 수정</h1>
      </div>
      <Separator />

      {/* 쿠폰 정보 (읽기 전용) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">쿠폰 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400">
              ID
            </Label>
            <div className="md:col-span-3 text-sm">{coupon.id}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400">
              시리얼 번호
            </Label>
            <div className="md:col-span-3 text-sm font-mono">
              {coupon.serial_number}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400">
              사용 여부
            </Label>
            <div className="md:col-span-3">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  coupon.is_used
                    ? "bg-gray-100 text-gray-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {coupon.is_used ? "사용됨" : "미사용"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400">
              활성 상태
            </Label>
            <div className="md:col-span-3">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  coupon.is_active
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {coupon.is_active ? "활성" : "비활성"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <Label className="text-sm text-gray-600 dark:text-gray-400">
              생성일
            </Label>
            <div className="md:col-span-3 text-sm">
              {dayjs(coupon.created_at).format("YYYY.MM.DD HH:mm")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수정 가능한 필드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">쿠폰 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 쿠폰명 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                쿠폰명
              </Label>
              <div className="md:col-span-3">
                <Input
                  value={conditionName}
                  onChange={(e) => setConditionName(e.target.value)}
                  className="w-full md:w-80"
                />
              </div>
            </div>

            {/* 지급 포인트 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                지급 포인트
              </Label>
              <div className="md:col-span-3">
                <Input
                  type="number"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  className="w-full md:w-80"
                  min={1}
                />
              </div>
            </div>

            {/* 만료일 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                만료일
              </Label>
              <div className="md:col-span-3">
                <Input
                  type="date"
                  value={expiredAt}
                  onChange={(e) => setExpiredAt(e.target.value)}
                  className="w-full md:w-80"
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                쿠폰 삭제
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "저장 중..." : "수정 저장"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
