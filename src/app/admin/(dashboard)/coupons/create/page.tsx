"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CouponCreatePage() {
  const router = useRouter();
  const fetch = useAdminFetch();

  const [serialNumber, setSerialNumber] = useState("");
  const [conditionName, setConditionName] = useState("");
  const [pointAmount, setPointAmount] = useState("");
  const [expiredAt, setExpiredAt] = useState(
    dayjs().add(30, "day").format("YYYY-MM-DD"),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serialNumber.trim()) {
      alert("시리얼 번호를 입력해주세요.");
      return;
    }
    if (!conditionName.trim()) {
      alert("쿠폰명을 입력해주세요.");
      return;
    }
    if (!pointAmount || Number(pointAmount) <= 0) {
      alert("지급 포인트를 올바르게 입력해주세요.");
      return;
    }
    if (!expiredAt) {
      alert("만료일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("/admin-coupon/coupon", {
        method: "POST",
        data: {
          serial_number: serialNumber.trim(),
          condition_name: conditionName.trim(),
          point_amount: Number(pointAmount),
          expired_at: expiredAt,
        },
      });
      alert("쿠폰이 성공적으로 생성되었습니다.");
      router.push("/admin/coupons/list");
    } catch (error) {
      console.error("쿠폰 생성 실패:", error);
      alert("쿠폰 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full flex-col space-y-4 md:space-y-6 p-4 md:p-6 lg:p-10">
      <div>
        <p className="text-xs md:text-sm text-muted-foreground">
          쿠폰 관리 &gt; 쿠폰 생성
        </p>
        <h1 className="text-xl md:text-2xl font-bold">쿠폰 생성</h1>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">새 쿠폰 생성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 시리얼 번호 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                시리얼 번호 (쿠폰 코드) <span className="text-red-500">*</span>
              </Label>
              <div className="md:col-span-3">
                <Input
                  value={serialNumber}
                  onChange={(e) =>
                    setSerialNumber(e.target.value.toUpperCase())
                  }
                  placeholder="예: WELCOME2025"
                  className="w-full md:w-80"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  앱에서 사용자가 입력할 쿠폰 코드입니다.
                </p>
              </div>
            </div>

            {/* 쿠폰명 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                쿠폰명 <span className="text-red-500">*</span>
              </Label>
              <div className="md:col-span-3">
                <Input
                  value={conditionName}
                  onChange={(e) => setConditionName(e.target.value)}
                  placeholder="예: 신규 가입 환영 쿠폰"
                  className="w-full md:w-80"
                />
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
                  placeholder="예: 1000"
                  className="w-full md:w-80"
                  min={1}
                />
              </div>
            </div>

            {/* 만료일 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                만료일 <span className="text-red-500">*</span>
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
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "생성 중..." : "쿠폰 생성"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
