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

    // 백엔드 API (CreateNewsDto)에 맞게 페이로드 구성
    const payload = {
      languages: languages.map((lang) => ({
        language: lang.language,
        title: lang.title,
        contents: lang.content, // 에디터 내용은 개별 언어별로 관리되어야 하지만 현재 구조상 한계 있음. 개선 필요.
      })),
      // 현재 에디터 구조상 내용은 하나만 관리되므로, 모든 언어에 동일한 내용(contentHtml)을 넣거나
      // 언어별 탭 전환 시 에디터 내용을 저장/복원하는 로직이 필요함.
      // 우선 현재 UI 구조에 맞춰, 선택된 언어 탭이 아닌 '모든' 설정된 언어에 현재 에디터 내용을 넣는 방식은 위험할 수 있음.
      // 하지만 사용자 요구사항에 따라 일단 현재 상태의 에디터 내용을 title과 함께 보냅니다.
      // *주의*: 다국어 입력 시 각 언어별로 내용을 다르게 입력하려면 UI 로직 수정이 선행되어야 함.
      // 현재는 languages 배열을 순회하며 title은 state에서, contents는 현재 에디터 값(contentHtml)을 사용하도록 수정.

      // 수정된 Payload 생성 로직:
      writer: "Admin",
      post_type: noticeType,
      importance: importance ? parseInt(importance) : undefined,
      pushNotification,
      startsAt: isImmediate
        ? undefined
        : `${startDate?.toISOString().split("T")[0]}T${startTime}:00`,
      endsAt: isPermanent
        ? undefined
        : `${endDate?.toISOString().split("T")[0]}T${endTime}:00`,
    };

    // languages 배열의 contents를 채우기 위한 로직 보완
    // 현재 UI에서는 하나의 에디터 인스턴스만 사용하므로, 다국어 컨텐츠 입력이 불완전할 수 있음.
    // 사용자가 각 언어 탭을 눌러 제목을 바꾸고 에디터 내용을 바꿔도, 마지막에 저장된 'languages' state에는 title만 있고 content는 비어있음.
    // 'addLanguage' 시점이나 탭 전환 시점에 content를 저장하지 않고 있음.
    // 이를 해결하기 위해 page.tsx의 상태 관리를 대폭 수정해야 하지만, 
    // 우선은 "현재 에디터에 보이는 내용"을 "현재 선택된 언어"의 내용으로 간주하거나, 
    // 혹은 "영어(기본)" 내용으로 전송하는 등 임시 처리가 필요.
    
    // **중요**: 사용자가 입력한 여러 언어의 제목과, 현재 에디터의 내용을 '모든 언어'의 내용으로 사용하거나
    // 혹은 languages state에 content 필드를 제대로 업데이트하는 로직이 선행되어야 함.
    // 기존 languages state에는 content 필드가 있으니, 이를 활용하도록 payload 매핑을 수정합니다.
    
    // 임시: 현재 에디터의 내용을 모든 언어의 content로 설정 (다국어 본문 분리는 UI 개편 필요)
    payload.languages = languages.map(l => ({
        language: l.language,
        title: l.title,
        contents: contentHtml 
    }));

    try {
      await fetch("/admin-news/create", { method: "POST", data: payload });
      alert("공지사항이 성공적으로 등록되었습니다.");
      router.push("/admin/notice/list");
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
