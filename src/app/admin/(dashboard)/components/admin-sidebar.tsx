"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

// 1. 중첩 가능한 데이터 구조 (이 구조는 이제 원하는 만큼 깊어질 수 있습니다)
const sidebarNav = [
  {
    title: "ICO 관리",
    url: "/admin",
    children: [
      { title: "스테이킹 관리", url: "/staking" },
      { title: "리퍼럴 관리", url: "/referral" },
      { title: "판매 관리", url: "/sales" },
      { title: "보너스 요율 관리", url: "/reward" },
    ],
  },
  {
    title: "App 관리",
    url: "/admin",
    children: [
      {
        title: "회원 관리",
        url: "/members",
        children: [
          {
            title: "관리자",
            url: "/managers",
            children: [
              { title: "관리자 조회", url: "/list" },
              { title: "관리자 계정 생성", url: "/create" },
            ],
          },
          {
            title: "회원",
            url: "/users",
            children: [
              { title: "회원 조회", url: "/list" },
              { title: "회원 계정 생성", url: "/create" },
            ],
          },
        ],
      },
      { title: "주행기록 관리", url: "/move-history" },
      {
        title: "포인트 관리",
        url: "/points",
        children: [
          {
            title: "포인트 지급 설정",
            url: "/setting",
            children: [
              { title: "포인트 지급 항목 조회", url: "/list" },
              { title: "포인트 지급 항목 생성", url: "/create" },
            ],
          },
          {
            title: "포인트 지급 및 교환 내역",
            url: "/history",
            children: [
              { title: "포인트 지급", url: "/create" },
              { title: "포인트 지급 내역 조회", url: "/list" },
              { title: "포인트 교환 내역 조회", url: "/exchange" },
            ],
          },
        ],
       },
      {
        title: "공지사항",
        url: "/notice",
        children: [
          { title: "공지사항 조회", url: "/list" },
          { title: "공지사항 생성", url: "/create" },
        ],
      },
      {
        title: "Push 알림",
        url: "/push-alert",
        children: [
          { title: "알림 조회", url: "/list" },
          { title: "알림 생성", url: "/create" },
        ],
      },
    ],
  },
];

// 2. 재귀적으로 메뉴를 렌더링하는 컴포넌트 (이전과 동일)
function RecursiveMenuItem({ item, parentPath = "", pathname }: { item: any, parentPath?: string, pathname: string }) {
  const hasChildren = item.children && item.children.length > 0;
  const currentPath = `${parentPath}${item.url}`;
  const isActiveBranch = pathname.startsWith(currentPath);
  const [isOpen, setIsOpen] = useState(isActiveBranch);

  useEffect(() => {
    if (isActiveBranch) {
      setIsOpen(true);
    }
  }, [pathname, isActiveBranch]);

  if (hasChildren) {
    return (
      <div className="py-1">
        <div
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={isActiveBranch ? "text-sky-500 font-semibold" : ""}>
            {item.title}
          </span>
          <span className="text-base text-neutral-500">{isOpen ? "−" : "+"}</span>
        </div>
        {isOpen && (
          <div className="pl-4 mt-1 ml-2 border-l border-neutral-200 dark:border-neutral-700">
            {item.children.map((child: any) => (
              <RecursiveMenuItem
                key={child.title}
                item={child}
                parentPath={currentPath}
                pathname={pathname}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <SidebarMenuItem className="px-2">
      <SidebarMenuButton asChild isActive={pathname === currentPath}>
        <a href={currentPath}>{item.title}</a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// 3. 메인 사이드바 컴포넌트 (수정된 부분)
export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className={"text-lg px-2 pt-3 font-medium"}>GOTCAR 관리자</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {/*
           * ✅ 이 부분이 핵심 수정사항입니다.
           * 이전의 복잡한 map() 대신, 새로운 데이터 구조(sidebarNav)를
           * 재귀 컴포넌트(RecursiveMenuItem)로 렌더링하도록 변경했습니다.
           */}
          {sidebarNav.map((item) => (
            <RecursiveMenuItem
              key={item.title}
              item={item}
              pathname={pathname}
            />
          ))}
        </SidebarMenu>
        <Button className={"m-5 mt-auto bg-neutral-30"} onClick={logout}>
          로그아웃
        </Button>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}