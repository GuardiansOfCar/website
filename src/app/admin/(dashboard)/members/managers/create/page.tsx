"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

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

export default function AdminManagerCreatePage() {
  const router = useRouter();
  const fetch = useAdminFetch();

  // 폼 상태 관리
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin");

  // 비밀번호 보이기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 등록 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname || !email || !password || !confirmPassword || !role) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload = {
      nickname,
      email,
      password,
      role,
    };

    try {
      await fetch("/admin-members/members/manager", {
        method: "POST",
        data: payload,
      });
      alert("관리자 계정이 성공적으로 생성되었습니다.");
      router.push("/admin/members/managers");
    } catch (error) {
      console.error("관리자 계정 생성 실패:", error);
      alert("계정 생성에 실패했습니다.");
    }
  };

  return (
    <main className="mx-auto flex w-full flex-col space-y-4 md:space-y-6 p-4 md:p-6 lg:p-10">
      <div>
        <p className="text-xs md:text-sm text-muted-foreground">
          관리자 &gt; 관리자 생성
        </p>
        <h1 className="text-xl md:text-2xl font-bold">관리자 생성</h1>
      </div>
      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* 관리자 정보 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">관리자 정보</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nickname">관리자 이름</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="관리자 이름 입력"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 입력"
                />
              </div>

              <div className="relative space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 right-1 h-7 w-7"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="relative space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 확인"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 right-1 h-7 w-7"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 관리자 역할 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">관리자 역할</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-2">
              <Label htmlFor="role">관리자 역할</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="w-full md:w-1/2">
                  <SelectValue placeholder="관리자 역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">일반 관리자</SelectItem>
                  <SelectItem value="subadmin">서브 관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 등록/취소 버튼 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            등록
          </Button>
        </div>
      </form>
    </main>
  );
}
