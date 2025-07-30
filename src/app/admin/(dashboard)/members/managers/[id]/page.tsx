"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
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

export default function AdminManagerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fetch = useAdminFetch();

  // 폼 상태 관리
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // 비밀번호 보이기/숨기기 상태
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // SWR을 사용하여 기존 관리자 데이터 불러오기
  const { data: adminData, isLoading } = useSWR(
    id ? `/v1/admin-members/members/manager/${id}` : null, 
    (url) => fetch(url)
  );

  // 데이터 로딩이 완료되면 폼 상태 업데이트
  useEffect(() => {
    if (adminData) {
      setNickname(adminData.nickname || "");
      setEmail(adminData.email || "");
      setRole(adminData.role || "");
    }
  }, [adminData]);

  // 수정 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 변경 로직 유효성 검사
    if (newPassword && newPassword !== confirmNewPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload: any = {
      user_id: parseInt(id),
      nickname,
      role,
    };

    // 새 비밀번호가 입력된 경우에만 payload에 추가
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      await fetch(`/v1/admin-members/members/manager/${id}`, { 
        method: "PATCH", 
        data: payload 
      });
      alert("관리자 정보가 성공적으로 수정되었습니다.");
      router.push("/admin/members/managers");
    } catch (error) {
      console.error("관리자 정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10">
      <div>
        <p className="text-sm text-muted-foreground">관리자 &gt; 관리자 조회 &gt; 관리자 수정</p>
        <h1 className="text-2xl font-bold">관리자 수정</h1>
      </div>
      <Separator />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 관리자 정보 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>관리자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nickname">관리자 이름</Label>
                <Input 
                  id="nickname" 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" value={email} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 관리자 역할 섹션 */}
        <Card>
          <CardHeader><CardTitle>관리자 역할</CardTitle></CardHeader>
          <CardContent>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="관리자 역할 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">일반 관리자</SelectItem>
                <SelectItem value="subadmin">서브 관리자</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* 비밀번호 변경 섹션 */}
        <Card>
          <CardHeader><CardTitle>비밀번호 변경</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">현재 비밀번호</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="비밀번호를 변경할 경우에만 입력"
              />
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="relative space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1 h-7 w-7" onClick={() => setShowNewPassword((prev) => !prev)}>
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative space-y-2">
                <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1 h-7 w-7" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 수정/취소 버튼 */}
        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>취소</Button>
          <Button type="submit" size="lg">수정</Button>
        </div>
      </form>
    </main>
  );
}