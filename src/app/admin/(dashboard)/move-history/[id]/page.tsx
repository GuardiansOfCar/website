"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import dayjs from "dayjs";
import { ArrowLeft, MapPin, Clock, Route, Car } from "lucide-react";

import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 주행 기록 상세 데이터 타입
interface DrivingHistoryDetail {
  id: number;
  user_name: string;
  user_id: number;
  move_date: string;
  active_time_seconds: number;
  start_at: string;
  end_at: string;
  day_of_week: string;
  distance: number;
  move_method: string;
  point: number;
  point_status: string;
  path_image_url?: string;
  score: number;
  status: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export default function DrivingHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fetch = useAdminFetch();
  const historyId = params.id as string;

  // 주행 기록 상세 데이터 요청
  const { data: historyData, isLoading } = useSWR(
    [`/v1/admin-move-history/${historyId}`],
    (args) => fetch(args[0])
  );

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full flex-col space-y-6 p-10">
        <div className="text-center">로딩 중...</div>
      </main>
    );
  }

  if (!historyData) {
    return (
      <main className="mx-auto flex w-full flex-col space-y-6 p-10">
        <div className="text-center">주행 기록을 찾을 수 없습니다.</div>
      </main>
    );
  }

  const history: DrivingHistoryDetail = historyData;

  return (
    <main className="mx-auto flex w-full flex-col space-y-6 p-10 bg-white dark:bg-black">
      {/* 헤더 */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">
            주행 데이터 &gt; 주행 상세
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            주행 상세 기록
          </h1>
        </div>
      </div>
      <Separator className="border-gray-200 dark:border-gray-700" />

      {/* 기본 정보 카드 */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>주행 기본 정보</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                회원 이름
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {history.user_name}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                주행 날짜
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {dayjs(history.move_date).format("YYYY년 MM월 DD일")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                주행 시간
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.floor(history.active_time_seconds / 60)}분{" "}
                {history.active_time_seconds % 60}초
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                주행 요일
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {history.day_of_week}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                주행 거리
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {history.distance} km
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                주행 모드
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {history.move_method}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주행 통계 카드 */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>주행 통계</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                주행 시간
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor(history.active_time_seconds / 60)}분{" "}
                {history.active_time_seconds % 60}초
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                획득 포인트
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {history.point} P
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                점수
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {history.score}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 위치 정보 카드 */}
      {(history.startLocation || history.endLocation) && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>위치 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.startLocation && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    출발지
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {history.startLocation}
                  </p>
                </div>
              )}
              {history.endLocation && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    도착지
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {history.endLocation}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 주행 이벤트 카드 */}
      {history.events && history.events.length > 0 && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
              <Route className="h-5 w-5" />
              <span>주행 이벤트</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.type}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dayjs(event.timestamp).format("HH:mm:ss")}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {event.location}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
        >
          목록으로 돌아가기
        </Button>
      </div>
    </main>
  );
}
