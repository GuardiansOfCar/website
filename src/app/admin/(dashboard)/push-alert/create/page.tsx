"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";

// Prisma Enum과 동일한 값을 사용
const notificationCategories = [
  { value: 'points_earned', label: '포인트 획득' },
  { value: 'g2e_submission', label: 'G2E 제출' },
  { value: 'event_rewards', label: '이벤트 보상' },
  { value: 'points_exchange', label: '포인트 교환' },
  { value: 'news', label: 'News' },
  { value: 'updates', label: 'Updates' },
  { value: 'profile_updates', label: '프로필 변경' },
  { value: 'password_change', label: '비밀번호 변경' },
  { value: 'login_activity', label: '로그인 활동' },
];

export default function PushAlertCreatePage() {
  const router = useRouter();
  const fetch = useAdminFetch();

  // --- 상태 관리 ---
  // const [data, setData] = useState(""); // 딥링크 등 추가 데이터
  const [category, setCategory] = useState("news"); // 기본 카테고리
  const [publishAt, setPublishAt] = useState<Date | undefined>(undefined);
  const [publishTime, setPublishTime] = useState("09:00");
  const [isImmediate, setIsImmediate] = useState(true);

  // --- 타겟팅 관련 상태 ---
  const [targetType, setTargetType] = useState("ALL"); // ALL, USER
  const [targetIds, setTargetIds] = useState(""); // 쉼표로 구분된 ID 입력용

  // 언어별 내용 상태 (서버 DTO에 맞춰 contents 배열 형태)
  const [languages, setLanguages] = useState([
    { id: 1, language: "en", title: "", content: "" }
  ]);

  // 등록 핸들러
  const handleSubmit = async () => {
    // targetIds를 숫자 배열로 변환
    const parsedTargetIds = targetIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

    if (targetType === 'USER' && parsedTargetIds.length === 0) {
      alert("특정 사용자 타겟팅 시 ID를 1개 이상 입력해주세요.");
      return;
    }

    // 서버 DTO에 맞춰 데이터 구성
    const payload = {
      contents: languages.map(lang => ({
        language: lang.language,
        title: lang.title,
        content: lang.content,
      })),
      // data: data || undefined,
      category: category,
      targetType: targetType,
      userIds: targetType === 'USER' ? parsedTargetIds : undefined,
      publishAt: isImmediate ? undefined : publishAt,
    };

    try {
      await fetch("/v1/admin-notification/create", { method: "POST", data: payload });
      alert("Push 알림이 성공적으로 등록되었습니다.");
      router.push("/admin/push-alert/list");
    } catch (error) {
      console.error("Push 알림 등록 실패:", error);
      alert("등록에 실패했습니다.");
    }
  };

  // --- 언어 관련 핸들러들 ---
  const addLanguage = () => {
    const newId = languages.length > 0 ? Math.max(...languages.map(l => l.id)) + 1 : 1;
    setLanguages([...languages, { id: newId, language: "en", title: "", content: "" }]);
  };
  
  const removeLanguage = (id: number) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };
  
  const updateLanguageField = (id: number, field: 'language' | 'title' | 'content', value: string) => {
    setLanguages(languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  // 시간 옵션 생성 (예: 00:00, 01:00, ...)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const languageOptions = [
    { value: "en", label: "영어" },
    { value: "ja", label: "일본어" },
    { value: "zh", label: "중국어" },
    { value: "es", label: "스페인어" },
    { value: "tr", label: "터키어" }
  ];

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10">
      <div>
        <p className="text-sm text-muted-foreground">Push 알림 &gt; Push 알림 생성</p>
        <h1 className="text-2xl font-bold">Push 알림 생성</h1>
      </div>
      <Separator />

      <div className="space-y-6">
        {/* 알림 카테고리 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">알림 카테고리</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {notificationCategories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 발송 대상 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">발송 대상</span>
          <div className="flex items-center space-x-2">
            <Button
              variant={targetType === 'ALL' ? 'default' : 'outline'}
              onClick={() => setTargetType('ALL')}
            >
              전체 사용자
            </Button>
            <Button
              variant={targetType === 'USER' ? 'default' : 'outline'}
              onClick={() => setTargetType('USER')}
            >
              특정 사용자
            </Button>
          </div>
        </div>

        {/* 대상 ID 입력 */}
        {targetType === 'USER' && (
          <div className="flex items-start space-x-4">
            <span className="w-32 shrink-0 font-semibold pt-2">사용자 ID</span>
            <div className="w-full">
              <Input
                value={targetIds}
                onChange={(e) => setTargetIds(e.target.value)}
                placeholder="사용자 ID를 쉼표(,)로 구분하여 입력하세요. (예: 1,2,3)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                알림을 보낼 사용자의 ID 목록입니다.
              </p>
            </div>
          </div>
        )}

        {/* 추가 데이터 (딥링크 등)
        <div className="flex items-start space-x-4">
          <span className="w-32 shrink-0 font-semibold pt-2">추가 데이터</span>
          <div className="w-full">
            <Input
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="딥링크 주소 또는 JSON 문자열 입력"
            />
            <p className="text-sm text-muted-foreground mt-1">
              알림과 함께 전송할 추가 데이터입니다. (선택사항)
            </p>
          </div>
        </div> */}

        {/* 발송 일시 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">발송 일시</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {publishAt ? dayjs(publishAt).format("YYYY.MM.DD") : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={publishAt}
                onSelect={setPublishAt}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={publishTime} onValueChange={setPublishTime} disabled={isImmediate}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {timeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox id="immediate" checked={isImmediate} onCheckedChange={(checked) => setIsImmediate(Boolean(checked))} />
            <label htmlFor="immediate">즉시 발송</label>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex justify-end">
        <Button onClick={addLanguage} variant="outline" size="sm">
          알림 언어 추가
        </Button>
      </div>
      <Separator />
      
      {/* Push 알림 내용 - 다국어 지원 */}
      {languages.map((lang, index) => (
        <div key={lang.id} className="space-y-4 rounded-md border p-4">
          <div className="flex items-center space-x-4">
            <span className="w-24 shrink-0 font-semibold">알림 언어</span>
            <Select value={lang.language} onValueChange={(value) => updateLanguageField(lang.id, 'language', value)}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {languageOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {languages.length > 1 && (
              <Button 
                onClick={() => removeLanguage(lang.id)} 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                삭제
              </Button>
            )}
          </div>
          {/* 제목 입력 */}
          <div className="flex items-start space-x-4">
            <span className="w-24 shrink-0 font-semibold pt-2">알림 제목</span>
            <div className="w-full">
              <Input
                value={lang.title}
                onChange={(e) => updateLanguageField(lang.id, 'title', e.target.value)}
                placeholder="Push 알림 제목을 입력해주세요."
              />
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="flex items-start space-x-4">
            <span className="w-24 shrink-0 font-semibold pt-2">알림 내용</span>
            <div className="w-full">
              <Textarea
                value={lang.content}
                onChange={(e) => updateLanguageField(lang.id, 'content', e.target.value)}
                placeholder="Push 알림 내용을 입력해주세요."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>
      ))}
      
      {/* 등록/취소 버튼 */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.back()}>뒤로</Button>
        <Button onClick={handleSubmit}>등록</Button>
      </div>
    </main>
  );
}