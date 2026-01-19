"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Pencil, Plus, Save, X, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const changeReasonOptions = [
  { value: "ATTENDANCE", label: "출석" },
  { value: "MOVING_EARN", label: "이동 적립" },
  { value: "INVITE_FRIEND", label: "친구 초대" },
  { value: "REFERRAL", label: "리퍼럴" },
  { value: "REGISTER", label: "회원가입" },
  { value: "COUPON", label: "쿠폰" },
  { value: "COMMENT", label: "댓글 작성" },
  { value: "WRITING", label: "글 작성" },
  { value: "LIKE", label: "좋아요" },
  { value: "EXCHANGE_POINTS", label: "포인트 교환" },
  { value: "TIER_UPGRADE", label: "티어 업그레이드" },
  { value: "GIFT", label: "선물" },
  { value: "MONTHLY_MOVE_BONUS", label: "월간 이동 보너스" },
  { value: "CONSECUTIVE_BONUS_5", label: "5일 연속 보너스" },
  { value: "CONSECUTIVE_BONUS_10", label: "10일 연속 보너스" },
  { value: "REFERRED_SUBMISSIONS", label: "피추천 제출" },
];

interface PointSetting {
  id: number;
  changeReason: string;
  changeReasonLabel: string;
  conditionName: string;
  description?: string;
  pointAmount: number;
  isActive: boolean;
}

export default function PointSettingsPage() {
  const fetch = useAdminFetch();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<PointSetting>>({});
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newSetting, setNewSetting] = useState<{
    change_reason: string;
    condition_name: string;
    description: string;
    point_amount: number;
    is_active: boolean;
  }>({
    change_reason: "ATTENDANCE",
    condition_name: "",
    description: "",
    point_amount: 0,
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  // 포인트 설정 목록 조회
  const { data: settingsData, isLoading: isLoadingSettings } = useSWR(
    "/admin-point/settings",
    (url) => fetch(url, { query: { page: 1, limit: 100 } })
  );

  const settings: PointSetting[] = settingsData?.data || [];

  // 수정 시작
  const handleEdit = (setting: PointSetting) => {
    setEditingId(setting.id);
    setEditData({ ...setting });
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // 수정 저장
  const handleSaveEdit = async () => {
    if (!editData.id) return;

    setIsLoading(true);
    try {
      await fetch(`/admin-point/settings/${editData.id}`, {
        method: "PUT",
        data: {
          condition_name: editData.conditionName,
          description: editData.description,
          point_amount: editData.pointAmount,
          is_active: editData.isActive,
        },
      });

      mutate("/admin-point/settings");
      setEditingId(null);
      setEditData({});
      alert("포인트 설정이 수정되었습니다.");
    } catch (error) {
      console.error("Failed to update setting:", error);
      alert("수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 새 설정 생성
  const handleCreate = async () => {
    if (!newSetting.condition_name) {
      alert("조건 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await fetch("/admin-point/settings", {
        method: "POST",
        data: newSetting,
      });

      mutate("/admin-point/settings");
      setIsCreateMode(false);
      setNewSetting({
        change_reason: "ATTENDANCE",
        condition_name: "",
        description: "",
        point_amount: 0,
        is_active: true,
      });
      alert("새 포인트 설정이 생성되었습니다.");
    } catch (error) {
      console.error("Failed to create setting:", error);
      alert("생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            포인트 지급 설정 관리
          </CardTitle>
          {!isCreateMode && (
            <Button onClick={() => setIsCreateMode(true)} className="gap-2">
              <Plus className="h-4 w-4" />새 설정 추가
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* 새 설정 생성 폼 */}
          {isCreateMode && (
            <Card className="mb-6 border-dashed border-2 border-primary/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">새 포인트 설정 생성</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>지급 사유</Label>
                    <Select
                      value={newSetting.change_reason}
                      onValueChange={(value) =>
                        setNewSetting({ ...newSetting, change_reason: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {changeReasonOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>조건 이름</Label>
                    <Input
                      value={newSetting.condition_name}
                      onChange={(e) =>
                        setNewSetting({
                          ...newSetting,
                          condition_name: e.target.value,
                        })
                      }
                      placeholder="예: 일일 출석 보상"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>설명</Label>
                    <Input
                      value={newSetting.description}
                      onChange={(e) =>
                        setNewSetting({
                          ...newSetting,
                          description: e.target.value,
                        })
                      }
                      placeholder="설명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>지급 포인트</Label>
                    <Input
                      type="number"
                      value={newSetting.point_amount || ""}
                      onChange={(e) =>
                        setNewSetting({
                          ...newSetting,
                          point_amount: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>활성 상태</Label>
                    <Select
                      value={newSetting.is_active ? "true" : "false"}
                      onValueChange={(value) =>
                        setNewSetting({
                          ...newSetting,
                          is_active: value === "true",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">활성</SelectItem>
                        <SelectItem value="false">비활성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateMode(false)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    취소
                  </Button>
                  <Button onClick={handleCreate} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-1" />
                    생성
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 설정 목록 테이블 */}
          {isLoadingSettings ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">지급 사유</TableHead>
                  <TableHead>조건 이름</TableHead>
                  <TableHead className="w-48">설명</TableHead>
                  <TableHead className="text-center w-28">
                    지급 포인트
                  </TableHead>
                  <TableHead className="text-center w-24">활성 상태</TableHead>
                  <TableHead className="w-32 text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      등록된 포인트 설정이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  settings.map((setting) => (
                    <TableRow key={setting.id}>
                      {editingId === setting.id ? (
                        // 수정 모드
                        <>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {changeReasonLabels[setting.changeReason] ||
                                setting.changeReason}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editData.conditionName || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  conditionName: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editData.description || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  description: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editData.pointAmount || 0}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  pointAmount: Number(e.target.value),
                                })
                              }
                              className="w-24 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant={
                                editData.isActive ? "default" : "outline"
                              }
                              onClick={() =>
                                setEditData({
                                  ...editData,
                                  isActive: !editData.isActive,
                                })
                              }
                              className={`${
                                editData.isActive
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  : "border-red-500 text-red-500 hover:bg-red-50"
                              }`}
                            >
                              {editData.isActive ? "활성" : "비활성"}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSaveEdit}
                                disabled={isLoading}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        // 보기 모드
                        <>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {changeReasonLabels[setting.changeReason] ||
                                setting.changeReason}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              {setting.conditionName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {setting.description || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium text-primary">
                              {setting.pointAmount.toLocaleString()}P
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-md text-xs text-white ${
                                setting.isActive
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {setting.isActive ? "활성" : "비활성"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(setting)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
