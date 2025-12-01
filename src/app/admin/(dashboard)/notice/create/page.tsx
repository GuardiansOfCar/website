"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Editor } from "@toast-ui/react-editor";
import { DateRange } from "react-day-picker";

import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";

// TuiEditor를 Dynamic Import로 불러옵니다 (SSR 비활성화)
const TuiEditor = dynamic(() => import("../components/TuiEditor"), {
  ssr: false,
});

export default function NoticeCreatePage() {
  const router = useRouter();
  const fetch = useAdminFetch();
  const editorRef = useRef<Editor | null>(null);

  // 폼 상태 관리
  const [noticeType, setNoticeType] = useState("ANNOUNCEMENT");
  const [pushNotification, setPushNotification] = useState(true);
  const [importance, setImportance] = useState<string>("");
  const [title, setTitle] = useState("서비스 점검 예정 안내");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [isImmediate, setIsImmediate] = useState(true);
  const [endDate, setEndDate] = useState<Date | undefined>(
    dayjs().add(1, "month").toDate()
  );
  const [endTime, setEndTime] = useState("24:00");
  const [isPermanent, setIsPermanent] = useState(false);

  // 다국어 지원을 위한 상태
  const [languages, setLanguages] = useState([
    { id: 1, language: "en", title: "", content: "" },
  ]);

  // 등록 핸들러
  const handleSubmit = async () => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) {
      alert("에디터 인스턴스를 찾을 수 없습니다.");
      return;
    }

    const contentHtml = editorInstance.getHTML();

    const payload = {
      type: noticeType,
      pushNotification,
      importance: importance ? parseInt(importance) : null,
      title,
      content: contentHtml,
      startsAt: isImmediate
        ? null
        : `${startDate?.toISOString().split("T")[0]}T${startTime}:00`,
      endsAt: isPermanent
        ? null
        : `${endDate?.toISOString().split("T")[0]}T${endTime}:00`,
      languages,
    };

    try {
      await fetch("/notices", { method: "POST", data: payload });
      alert("공지사항이 성공적으로 등록되었습니다.");
      router.push("/admin/notice");
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("등록에 실패했습니다.");
    }
  };

  // 언어 추가 핸들러
  const addLanguage = () => {
    const newId = Math.max(...languages.map((l) => l.id)) + 1;
    setLanguages([
      ...languages,
      { id: newId, language: "en", title: "", content: "" },
    ]);
  };

  // 언어 삭제 핸들러
  const removeLanguage = (id: number) => {
    const languageToRemove = languages.find((l) => l.id === id);
    if (languageToRemove?.language === "en") {
      alert("영어는 기본 언어이므로 삭제할 수 없습니다.");
      return;
    }
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  // 언어 변경 핸들러
  const updateLanguage = (id: number, language: string) => {
    setLanguages(
      languages.map((lang) => (lang.id === id ? { ...lang, language } : lang))
    );
  };

  // 시간 옵션 생성 (예: 00:00, 01:00, ...)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const languageOptions = [
    { value: "en", label: "영어" },
    { value: "es", label: "스페인어" },
    { value: "zh", label: "중국어" },
    { value: "ja", label: "일본어" },
    { value: "tr", label: "터키어" },
  ];

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10">
      <div>
        <p className="text-sm text-muted-foreground">
          공지사항 &gt; 공지사항 등록
        </p>
        <h1 className="text-2xl font-bold">공지사항 등록</h1>
      </div>
      <Separator />

      <div className="space-y-6">
        {/* 공지 유형 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">공지 유형</span>
          <Select value={noticeType} onValueChange={setNoticeType}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANNOUNCEMENT">공지사항</SelectItem>
              <SelectItem value="EVENT">이벤트</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              checked={pushNotification}
              onCheckedChange={setPushNotification}
            />
            <span>Push 알림</span>
          </div>
        </div>

        {/* 공지 중요도 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">중요도</span>
          <Input
            type="number"
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
            placeholder="중요도를 입력해주세요."
            className="w-[180px]"
          />
        </div>

        {/* 공지 시작 일자 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">게시일자</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? dayjs(startDate).format("YYYY.MM.DD")
                  : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select
            value={startTime}
            onValueChange={setStartTime}
            disabled={isImmediate}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="immediate"
              checked={isImmediate}
              onCheckedChange={(checked) => setIsImmediate(Boolean(checked))}
            />
            <label htmlFor="immediate">바로 등록</label>
          </div>
        </div>

        {/* 공지 종료 일자 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">게시 종료일</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? dayjs(endDate).format("YYYY.MM.DD") : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select
            value={endTime}
            onValueChange={setEndTime}
            disabled={isPermanent}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="permanent"
              checked={isPermanent}
              onCheckedChange={(checked) => setIsPermanent(Boolean(checked))}
            />
            <label htmlFor="permanent">계속 노출 유지</label>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex justify-end">
        <Button onClick={addLanguage} variant="outline" size="sm">
          공지 언어 추가
        </Button>
      </div>
      <Separator />
      {/* 공지 제목 및 내용 - 다국어 지원 */}
      {languages.map((lang, index) => (
        <div key={lang.id} className="space-y-4 rounded-md border p-4">
          <div className="flex items-center space-x-4">
            <span className="w-24 shrink-0 font-semibold">공지 언어</span>
            <Select
              value={lang.language}
              onValueChange={(value) => updateLanguage(lang.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {lang.language !== "en" && (
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
          <div className="flex items-center space-x-4">
            <span className="w-24 shrink-0 font-semibold">제목</span>
            <Input
              value={lang.title}
              onChange={(e) => {
                const updatedLanguages = languages.map((l) =>
                  l.id === lang.id ? { ...l, title: e.target.value } : l
                );
                setLanguages(updatedLanguages);
              }}
              placeholder="제목을 입력해주세요."
            />
          </div>
          <div className="flex items-start space-x-4">
            <span className="w-24 shrink-0 font-semibold pt-2">내용</span>
            <div className="w-full">
              <TuiEditor ref={editorRef} />
            </div>
          </div>
        </div>
      ))}

      {/* 등록/취소 버튼 */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          뒤로
        </Button>
        <Button onClick={handleSubmit}>등록</Button>
      </div>
    </main>
  );
}
