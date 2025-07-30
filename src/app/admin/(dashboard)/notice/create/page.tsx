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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
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
  const [noticeType, setNoticeType] = useState("NORMAL");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [isImmediate, setIsImmediate] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState("23:59");
  const [isPermanent, setIsPermanent] = useState(false);

  // 필터 상태 관리
  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate ? dayjs(startDate).toDate() : undefined,
    to: endDate ? dayjs(endDate).toDate() : undefined,
  });

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
      title,
      content: contentHtml,
      startsAt: isImmediate ? null : `${startDate?.toISOString().split("T")[0]}T${startTime}:00`,
      endsAt: isPermanent ? null : `${endDate?.toISOString().split("T")[0]}T${endTime}:00`,
    };

    try {
      await fetch("/v1/notices", { method: "POST", data: payload }); // API 엔드포인트는 실제 환경에 맞게 수정
      alert("공지사항이 성공적으로 등록되었습니다.");
      router.push("/admin/notice"); // 등록 후 목록 페이지로 이동
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("등록에 실패했습니다.");
    }
  };

  // 시간 옵션 생성 (예: 00:00, 01:00, ...)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10">
      <div>
        <p className="text-sm text-muted-foreground">공지사항 &gt; 공지사항 등록</p>
        <h1 className="text-2xl font-bold">공지사항 등록</h1>
      </div>
      <Separator />

      <div className="space-y-6">
        {/* 공지 유형 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">공지 유형</span>
          <Select value={noticeType} onValueChange={setNoticeType}>
            <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="NORMAL">일반</SelectItem>
              <SelectItem value="URGENT">긴급</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 공지 시작 일자 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">공지 시작 일자</span>
          <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
          <Select value={startTime} onValueChange={setStartTime} disabled={isImmediate}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {timeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox id="immediate" checked={isImmediate} onCheckedChange={(checked) => setIsImmediate(Boolean(checked))} />
            <label htmlFor="immediate">바로 등록</label>
          </div>
        </div>
        
        {/* 공지 종료 일자 */}
        <div className="flex items-center space-x-4">
          <span className="w-32 shrink-0 font-semibold">공지 종료 일자</span>
          <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
          <Select value={endTime} onValueChange={setEndTime} disabled={isPermanent}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {timeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox id="permanent" checked={isPermanent} onCheckedChange={(checked) => setIsPermanent(Boolean(checked))} />
            <label htmlFor="permanent">계속 노출</label>
          </div>
        </div>
      </div>
      <Separator />

      {/* 공지 제목 및 내용 */}
      <div className="space-y-4 rounded-md border p-4">
        <div className="flex items-center space-x-4">
          <span className="w-24 shrink-0 font-semibold">제목</span>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
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
      
      {/* 등록/취소 버튼 */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.back()}>뒤로</Button>
        <Button onClick={handleSubmit}>등록</Button>
      </div>
    </main>
  );
}