"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { Separator } from "@/app/v2/components/ui/separator";
import { Input } from "@/app/v2/components/ui/input";
import { Button } from "@/app/v2/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/v2/components/ui/card";
import { Label } from "@/app/v2/components/ui/label";

export default function MemberCreatePage() {
  const router = useRouter();
  const fetch = useAdminFetch();

  // 폼 상태 관리
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // 비밀번호 보이기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 등록 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname || !email || !password || !confirmPassword) {
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
      password 
    };

    try {
      await fetch("/v1/admin-members/members/user", { 
        method: "POST", 
        data: payload 
      }); 
      alert("회원 계정이 성공적으로 생성되었습니다.");
      router.push("/admin/members/users"); 
    } catch (error) {
      console.error("회원 계정 생성 실패:", error);
      alert("계정 생성에 실패했습니다.");
    }
  };

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10">
      <div>
        <p className="text-sm text-muted-foreground">회원 &gt; 회원 계정 생성</p>
        <h1 className="text-2xl font-bold">회원 계정 생성</h1>
      </div>
      <Separator />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>회원 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              {/* 회원 이름 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">회원 이름</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="회원 이름 입력"
                />
              </div>

              {/* 이메일 주소 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소 입력"
                />
              </div>

              {/* 비밀번호 */}
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {/* 비밀번호 확인 */}
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
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 등록/취소 버튼 */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" size="lg">
            등록
          </Button>
        </div>
      </form>
    </main>
  );
}