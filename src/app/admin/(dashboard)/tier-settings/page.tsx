"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Pencil, Plus, Trash2, Save, X, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TierSetting {
  id: number;
  grade: number;
  name: string;
  referral_req: number;
  point_earned: number;
  multiplier: number;
  upgrade_price: number;
  is_active: boolean;
}

export default function TierSettingsPage() {
  const fetch = useAdminFetch();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<TierSetting>>({});
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newTier, setNewTier] = useState<Partial<TierSetting>>({
    grade: 1,
    name: "",
    referral_req: 0,
    point_earned: 0,
    multiplier: 1.0,
    upgrade_price: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // 티어 목록 조회
  const { data: tiersData, isLoading: isLoadingTiers } = useSWR(
    "/admin-tier/tier",
    (url) => fetch(url, { query: { page: 1, limit: 100 } })
  );

  const tiers: TierSetting[] = tiersData?.tiers || [];

  // 수정 시작
  const handleEdit = (tier: TierSetting) => {
    setEditingId(tier.id);
    setEditData({ ...tier });
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
      await fetch("/admin-tier/update-tier", {
        method: "PATCH",
        data: {
          id: editData.id,
          name: editData.name,
          referral_req: editData.referral_req,
          point_earned: editData.point_earned,
          multiplier: editData.multiplier,
          upgrade_price: editData.upgrade_price,
          is_active: editData.is_active,
        },
      });

      // 데이터 새로고침
      mutate("/admin-tier/tier");
      setEditingId(null);
      setEditData({});
      alert("티어 설정이 수정되었습니다.");
    } catch (error) {
      console.error("Failed to update tier:", error);
      alert("수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 새 티어 생성
  const handleCreate = async () => {
    if (!newTier.name) {
      alert("티어 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await fetch("/admin-tier/create-tier", {
        method: "POST",
        data: {
          grade: newTier.grade,
          name: newTier.name,
          referral_req: newTier.referral_req,
          point_earned: newTier.point_earned,
          multiplier: newTier.multiplier,
          upgrade_price: newTier.upgrade_price,
        },
      });

      // 데이터 새로고침
      mutate("/admin-tier/tier");
      setIsCreateMode(false);
      setNewTier({
        grade: 1,
        name: "",
        referral_req: 0,
        point_earned: 0,
        multiplier: 1.0,
        upgrade_price: 0,
      });
      alert("새 티어가 생성되었습니다.");
    } catch (error) {
      console.error("Failed to create tier:", error);
      alert("생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 삭제 실행
  const handleDeleteClick = async (tier: TierSetting) => {
    if (!confirm(`정말로 "${tier.name}" 티어를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await fetch(`/admin-tier/tier/${tier.id}`, {
        method: "DELETE",
      });

      // 데이터 새로고침
      mutate("/admin-tier/tier");
      alert("티어가 삭제되었습니다.");
    } catch (error) {
      console.error("Failed to delete tier:", error);
      alert("삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">티어 설정 관리</CardTitle>
          {!isCreateMode && (
            <Button onClick={() => setIsCreateMode(true)} className="gap-2">
              <Plus className="h-4 w-4" />새 티어 추가
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* 새 티어 생성 폼 */}
          {isCreateMode && (
            <Card className="mb-6 border-dashed border-2 border-primary/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">새 티어 생성</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label>등급 (Grade)</Label>
                    <Input
                      type="number"
                      value={newTier.grade || ""}
                      onChange={(e) =>
                        setNewTier({
                          ...newTier,
                          grade: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>이름</Label>
                    <Input
                      value={newTier.name || ""}
                      onChange={(e) =>
                        setNewTier({ ...newTier, name: e.target.value })
                      }
                      placeholder="예: Explorer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>추천 필요 수</Label>
                    <Input
                      type="number"
                      value={newTier.referral_req || ""}
                      onChange={(e) =>
                        setNewTier({
                          ...newTier,
                          referral_req: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>누적 포인트 조건</Label>
                    <Input
                      type="number"
                      value={newTier.point_earned || ""}
                      onChange={(e) =>
                        setNewTier({
                          ...newTier,
                          point_earned: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>배수 (Multiplier)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newTier.multiplier || ""}
                      onChange={(e) =>
                        setNewTier({
                          ...newTier,
                          multiplier: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>업그레이드 가격</Label>
                    <Input
                      type="number"
                      value={newTier.upgrade_price || ""}
                      onChange={(e) =>
                        setNewTier({
                          ...newTier,
                          upgrade_price: Number(e.target.value),
                        })
                      }
                    />
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

          {/* 티어 목록 테이블 */}
          {isLoadingTiers ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">등급</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead className="text-center">추천 필요 수</TableHead>
                  <TableHead className="text-center">
                    누적 포인트 조건
                  </TableHead>
                  <TableHead className="text-center">배수</TableHead>
                  <TableHead className="text-center">업그레이드 가격</TableHead>
                  <TableHead className="text-center">활성 상태</TableHead>
                  <TableHead className="w-32 text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      등록된 티어가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  tiers.map((tier) => (
                    <TableRow key={tier.id}>
                      {editingId === tier.id ? (
                        // 수정 모드
                        <>
                          <TableCell>
                            <span className="font-medium">{tier.grade}</span>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editData.name || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name: e.target.value,
                                })
                              }
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editData.referral_req || 0}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  referral_req: Number(e.target.value),
                                })
                              }
                              className="w-24 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editData.point_earned || 0}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  point_earned: Number(e.target.value),
                                })
                              }
                              className="w-28 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.1"
                              value={editData.multiplier || 1}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  multiplier: Number(e.target.value),
                                })
                              }
                              className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editData.upgrade_price || 0}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  upgrade_price: Number(e.target.value),
                                })
                              }
                              className="w-28 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant={editData.is_active ? "default" : "outline"}
                              onClick={() =>
                                setEditData({
                                  ...editData,
                                  is_active: !editData.is_active,
                                })
                              }
                              className={`${
                                editData.is_active
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  : "border-red-500 text-red-500 hover:bg-red-50"
                              }`}
                            >
                              {editData.is_active ? "활성" : "비활성"}
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
                            <span className="font-medium">{tier.grade}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{tier.name}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {tier.referral_req}명
                          </TableCell>
                          <TableCell className="text-center">
                            {tier.point_earned.toLocaleString()}P
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium text-primary">
                              x{tier.multiplier}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {tier.upgrade_price.toLocaleString()}P
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-md text-xs text-white ${
                                tier.is_active ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            >
                              {tier.is_active ? "활성" : "비활성"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(tier)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(tier)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
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
