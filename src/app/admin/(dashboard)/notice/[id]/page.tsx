"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Editor } from "@toast-ui/react-editor";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";

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
import useSWR from "swr";

const TuiEditor = dynamic(() => import("../components/TuiEditor"), {
  ssr: false,
});

export default function NoticeEditPage() {
  const router = useRouter();
  const params = useParams();
  const fetch = useAdminFetch();
  const editorRef = useRef<Editor | null>(null);
  const noticeId = params.id;

  // 데이터 조회
  const { data: noticeData, error } = useSWR(
    noticeId ? `/admin-news/detail/${noticeId}` : null,
    fetch,
  );

  // 폼 상태 관리
  const [noticeType, setNoticeType] = useState("ANNOUNCEMENT");
  const [pushNotification, setPushNotification] = useState(false);
  const [importance, setImportance] = useState<string>("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("09:00");
  const [isImmediate, setIsImmediate] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState("24:00");
  const [isPermanent, setIsPermanent] = useState(false);

  // 다국어 상태
  const [languages, setLanguages] = useState([
    { id: 1, language: "en", title: "", content: "" },
  ]);

  // 데이터 로드 시 상태 초기화
  useEffect(() => {
    if (noticeData) {
      setNoticeType(noticeData.post_type);
      setImportance(noticeData.importance?.toString() || "");
      setTitle(noticeData.title);

      // 다국어 데이터 설정
      if (noticeData.translations && noticeData.translations.length > 0) {
        setLanguages(
          noticeData.translations.map((t: any, idx: number) => ({
            id: idx + 1,
            language: t.language.toLowerCase(),
            title: t.title,
            content: t.contents,
          })),
        );

        // 에디터 내용 설정 (첫 번째 언어 기준)
        if (editorRef.current) {
          editorRef.current
            .getInstance()
            .setHTML(noticeData.translations[0].contents);
        }
      } else {
        // 레거시 호환
        if (editorRef.current) {
          editorRef.current.getInstance().setHTML(noticeData.contents);
        }
      }

      // 날짜/시간 설정
      if (noticeData.started_at) {
        setStartDate(new Date(noticeData.started_at));
        setStartTime(dayjs(noticeData.started_at).format("HH:mm"));
        setIsImmediate(false);
      } else {
        setIsImmediate(true);
      }
      if (noticeData.end_at) {
        setEndDate(new Date(noticeData.end_at));
        setEndTime(dayjs(noticeData.end_at).format("HH:mm"));
        setIsPermanent(false);
      } else {
        setIsPermanent(true);
      }
      if (noticeData.push_alert !== undefined) {
        setPushNotification(noticeData.push_alert);
      }
    }
  }, [noticeData]);

  // 수정 핸들러
  const handleSubmit = async () => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    const contentHtml = editorInstance.getHTML();

    const payload = {
      post_id: Number(noticeId),
      title: languages.find((l) => l.language === "en")?.title || title, // 영어 제목 우선
      contents: contentHtml,
      writer: "Admin",
      post_type: noticeType,
      importance: importance ? parseInt(importance) : 0,
      languages: languages.map((l) => ({
        language: l.language.toUpperCase(),
        title: l.title,
        contents: contentHtml, // 현재 에디터 내용 사용
      })),
      startsAt: isImmediate
        ? undefined
        : startDate
          ? dayjs(startDate).format("YYYY-MM-DD") + "T" + startTime + ":00Z"
          : undefined,
      endsAt: isPermanent
        ? undefined
        : endDate
          ? dayjs(endDate).format("YYYY-MM-DD") + "T" + endTime + ":00Z"
          : undefined,
      pushNotification: pushNotification,
    };

    try {
      await fetch("/admin-news/update", { method: "PATCH", data: payload });
      alert("공지사항이 성공적으로 수정되었습니다.");
      router.push("/admin/notice/list");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await fetch(`/admin-news/delete/${noticeId}`, { method: "DELETE" });
      alert("삭제되었습니다.");
      router.push("/admin/notice/list");
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    }
  };

  // 언어 관련 핸들러들 (create 페이지와 동일하게 구현 필요) -> 컴포넌트 분리 권장
  const updateLanguage = (id: number, language: string) => {
    setLanguages((prev) =>
      prev.map((l) => (l.id === id ? { ...l, language } : l)),
    );
  };

  // 언어 삭제 핸들러
  const removeLanguage = (id: number) => {
    // 첫 번째 항목은 삭제 불가
    if (languages[0]?.id === id) {
      alert("첫 번째 언어는 삭제할 수 없습니다.");
      return;
    }
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  // 언어 추가 핸들러
  const addLanguage = () => {
    const newId = Math.max(...languages.map((l) => l.id)) + 1;
    setLanguages([
      ...languages,
      { id: newId, language: "ko", title: "", content: "" },
    ]);
  };

  if (!noticeData && !error) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10">
      <div>
        <p className="text-sm text-muted-foreground">
          공지사항 &gt; 공지사항 수정
        </p>
        <h1 className="text-2xl font-bold">공지사항 수정</h1>
      </div>
      <Separator />

      <div className="space-y-6">
        {/* 기본 정보 수정 폼 (공지 유형, 중요도 등) */}
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
        </div>

        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">중요도</span>
          <Input
            type="number"
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
            className="w-[180px]"
          />
        </div>

        {/* 푸시 알림 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">푸시 알림</span>
          <Switch
            checked={pushNotification}
            onCheckedChange={setPushNotification}
          />
          <span className="text-sm text-muted-foreground">
            {pushNotification ? "발송" : "미발송"}
          </span>
        </div>

        {/* 게시 시작일 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">게시 시작일</span>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isImmediate}
              onCheckedChange={(checked) => setIsImmediate(checked === true)}
            />
            <span className="text-sm">즉시 게시</span>
          </div>
          {!isImmediate && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? dayjs(startDate).format("YYYY-MM-DD")
                      : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-[120px]"
              />
            </>
          )}
        </div>

        {/* 게시 종료일 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">게시 종료일</span>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isPermanent}
              onCheckedChange={(checked) => setIsPermanent(checked === true)}
            />
            <span className="text-sm">상시 게시</span>
          </div>
          {!isPermanent && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate
                      ? dayjs(endDate).format("YYYY-MM-DD")
                      : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-[120px]"
              />
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* 다국어 편집 영역 */}
      {languages.map((lang, index) => (
        <div key={lang.id} className="space-y-4 rounded-md border p-4">
          <div className="flex items-center space-x-4">
            <span className="w-24 shrink-0 font-semibold">언어</span>
            <Select
              value={lang.language}
              onValueChange={(val) => updateLanguage(lang.id, val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">영어</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="ja">일본어</SelectItem>
                <SelectItem value="zh">중국어</SelectItem>
                <SelectItem value="es">스페인어</SelectItem>
                <SelectItem value="tr">터키어</SelectItem>
              </SelectContent>
            </Select>
            {index !== 0 && (
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
                setLanguages((prev) =>
                  prev.map((l) =>
                    l.id === lang.id ? { ...l, title: e.target.value } : l,
                  ),
                );
              }}
            />
          </div>
          <div className="flex items-start space-x-4">
            <span className="w-24 shrink-0 font-semibold pt-2">내용</span>
            <div className="w-full">
              {/* 에디터는 하나만 렌더링하고 상태에 따라 내용 교체하는 것이 복잡하므로, 
                        현재 구현에서는 첫 번째 언어(혹은 선택된 언어)의 내용만 에디터에 표시 */}
              <TuiEditor
                key={lang.content ? `loaded-${lang.id}` : `empty-${lang.id}`}
                ref={editorRef}
                initialValue={lang.content}
              />
            </div>
          </div>
        </div>
      ))}

      {/* 언어 추가 버튼 */}
      <Button variant="outline" onClick={addLanguage}>
        + 언어 추가
      </Button>

      <div className="flex justify-end space-x-2">
        <Button variant="destructive" onClick={handleDelete}>
          삭제
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button onClick={handleSubmit}>수정 완료</Button>
      </div>
    </main>
  );
}
