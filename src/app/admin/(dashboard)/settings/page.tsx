"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X, Wallet, RefreshCw, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function SystemSettingsPage() {
  const fetch = useAdminFetch();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 모든 설정 조회
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error,
  } = useSWR<SystemSetting[]>("/admin/settings", (url: string) => fetch(url));

  // 메시지 자동 숨기기
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 수정 시작
  const handleEdit = (setting: SystemSetting) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  // 수정 저장
  const handleSave = async (key: string, description?: string | null) => {
    if (!editValue.trim()) {
      setMessage({ type: "error", text: "값을 입력해주세요." });
      return;
    }

    // 간단한 지갑 주소 검증
    if (key === "FOUNDATION_WALLET_ADDRESS" && !editValue.startsWith("0x")) {
      setMessage({
        type: "error",
        text: "유효한 지갑 주소를 입력해주세요. (0x로 시작)",
      });
      return;
    }

    setIsLoading(true);
    try {
      await fetch("/admin/settings", {
        method: "PUT",
        data: {
          key,
          value: editValue.trim(),
          description: description || undefined,
        },
      });

      mutate("/admin/settings");
      setEditingKey(null);
      setEditValue("");
      setMessage({ type: "success", text: "설정이 저장되었습니다." });
    } catch (error) {
      console.error("Failed to update setting:", error);
      setMessage({ type: "error", text: "저장에 실패했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  // 기본값 초기화
  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      await fetch("/admin/settings/initialize", {
        method: "POST",
      });

      mutate("/admin/settings");
      setMessage({ type: "success", text: "기본 설정이 초기화되었습니다." });
    } catch (error) {
      console.error("Failed to initialize settings:", error);
      setMessage({ type: "error", text: "초기화에 실패했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  // BSCScan 링크 열기
  const openBscScan = (address: string) => {
    window.open(`https://bscscan.com/address/${address}`, "_blank");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getSettingDisplayName = (key: string) => {
    const names: Record<string, string> = {
      FOUNDATION_WALLET_ADDRESS: "Foundation Wallet Address (GOTCAR 수신용)",
    };
    return names[key] || key;
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500">설정을 불러오는데 실패했습니다.</div>
        <Button onClick={handleInitialize} disabled={isLoading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          기본값으로 초기화
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            시스템 설정
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            시스템 전역 설정을 관리합니다.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleInitialize}
          disabled={isLoading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          기본값 초기화
        </Button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "error"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Foundation Wallet Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-500" />
            <CardTitle>지갑 설정</CardTitle>
          </div>
          <CardDescription>
            GOTCAR 토큰을 수신할 Foundation 지갑 주소를 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!settings || settings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>설정이 없습니다. 기본값으로 초기화해주세요.</p>
              <Button
                className="mt-4"
                onClick={handleInitialize}
                disabled={isLoading}
              >
                기본값으로 초기화
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">설정</TableHead>
                  <TableHead>값</TableHead>
                  <TableHead className="w-[180px]">최종 수정일</TableHead>
                  <TableHead className="w-[120px] text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting) => (
                  <TableRow key={setting.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">
                          {getSettingDisplayName(setting.key)}
                        </div>
                        {setting.description && (
                          <div className="text-sm text-gray-500">
                            {setting.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingKey === setting.key ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="값 입력"
                          className="font-mono text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono break-all">
                            {setting.value}
                          </code>
                          {setting.key === "FOUNDATION_WALLET_ADDRESS" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openBscScan(setting.value)}
                              title="BSCScan에서 보기"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(setting.updated_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingKey === setting.key ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleSave(setting.key, setting.description)
                            }
                            disabled={isLoading}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(setting)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Foundation Wallet Address 정보
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                이 지갑 주소는 사용자가 포인트 구매 시 GOTCAR 토큰을 전송하는
                목적지 주소입니다. 변경 시 모바일 앱에서 자동으로 새 주소를
                사용하게 됩니다.
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                <strong>네트워크:</strong> BNB Smart Chain (BSC)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
