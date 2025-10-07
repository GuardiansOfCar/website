"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  UserCheck,
  UserPlus,
  BarChart3,
  Gift,
  Bell,
  FileText,
  Settings,
  LogOut,
  Car,
  TrendingUp,
  History,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 현대적인 사이드바 네비게이션 구조
const sidebarNav = [
  {
    title: "ICO 관리",
    icon: TrendingUp,
    children: [
      {
        title: "스테이킹 관리",
        url: "/admin/staking",
        icon: Target,
      },
      {
        title: "리퍼럴 관리",
        url: "/admin/referral",
        icon: Users,
      },
      {
        title: "판매 관리",
        url: "/admin/sales",
        icon: BarChart3,
      },
      {
        title: "보너스 요율 관리",
        url: "/admin/reward",
        icon: Gift,
      },
    ],
  },
  {
    title: "회원 관리",
    icon: Users,
    children: [
      {
        title: "관리자",
        icon: UserCheck,
        children: [
          {
            title: "관리자 조회",
            url: "/admin/members/managers/list",
            icon: Users,
          },
          {
            title: "관리자 계정 생성",
            url: "/admin/members/managers/create",
            icon: UserPlus,
          },
        ],
      },
      {
        title: "일반 회원",
        icon: Users,
        children: [
          {
            title: "회원 조회",
            url: "/admin/members/users/list",
            icon: Users,
          },
          {
            title: "회원 계정 생성",
            url: "/admin/members/users/create",
            icon: UserPlus,
          },
        ],
      },
    ],
  },
  {
    title: "주행기록 관리",
    url: "/admin/move-history",
    icon: Car,
  },
  {
    title: "공지사항",
    icon: FileText,
    children: [
      {
        title: "공지사항 조회",
        url: "/admin/notice/list",
        icon: FileText,
      },
      {
        title: "공지사항 생성",
        url: "/admin/notice/create",
        icon: FileText,
      },
    ],
  },
  {
    title: "Push 알림",
    icon: Bell,
    children: [
      {
        title: "알림 조회",
        url: "/admin/push-alert/list",
        icon: Bell,
      },
      {
        title: "알림 생성",
        url: "/admin/push-alert/create",
        icon: Bell,
      },
    ],
  },
];

// 중첩된 메뉴 아이템의 내용만 렌더링하는 컴포넌트 (li 태그 없이)
function RecursiveMenuItemContent({
  item,
  pathname,
}: {
  item: any;
  pathname: string;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const currentPath = item.url;
  const isActive = pathname === currentPath;
  const isActiveBranch = pathname.startsWith(currentPath);
  const [isOpen, setIsOpen] = useState(isActiveBranch);
  const Icon = item.icon;

  useEffect(() => {
    if (isActiveBranch) {
      setIsOpen(true);
    }
  }, [pathname, isActiveBranch]);

  if (hasChildren) {
    return (
      <>
        <SidebarMenuButton
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between transition-all duration-200 text-gray-700 dark:text-[#B4B5B1] hover:bg-gray-100 dark:hover:bg-gray-800",
            isActiveBranch &&
              "bg-sidebar-accent text-sidebar-accent-foreground dark:bg-gray-800 dark:text-white"
          )}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="truncate">{item.title}</span>
          </div>
          <div className="transition-transform duration-200">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </SidebarMenuButton>
        {isOpen && (
          <SidebarMenuSub className="animate-in slide-in-from-top-1 duration-200">
            {item.children.map((child: any) => (
              <SidebarMenuSubItem key={child.title}>
                <RecursiveMenuItemContent item={child} pathname={pathname} />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </>
    );
  }

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="transition-all duration-200 hover:bg-sidebar-accent/50 text-gray-700 dark:text-[#B4B5B1] hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <a href={currentPath} className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="truncate">{item.title}</span>
      </a>
    </SidebarMenuButton>
  );
}

// 현대적인 재귀 메뉴 아이템 컴포넌트
function RecursiveMenuItem({
  item,
  pathname,
}: {
  item: any;
  pathname: string;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const currentPath = item.url;
  const isActive = pathname === currentPath;
  const isActiveBranch = pathname.startsWith(currentPath);
  // ICO 관리 메뉴는 기본적으로 열려있도록 설정
  const [isOpen, setIsOpen] = useState(
    isActiveBranch || item.title === "ICO 관리"
  );
  const Icon = item.icon;

  useEffect(() => {
    if (isActiveBranch) {
      setIsOpen(true);
    }
  }, [pathname, isActiveBranch]);

  return (
    <SidebarMenuItem>
      <RecursiveMenuItemContent item={item} pathname={pathname} />
    </SidebarMenuItem>
  );
}

// 현대적인 메인 사이드바 컴포넌트
export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="inset"
      {...props}
      className="bg-white dark:bg-[#1B1C1B] border-r border-gray-200 dark:border-gray-700"
    >
      <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-primary/10 dark:from-gray-800/50 dark:to-gray-700/50">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Car className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground dark:text-white">
              GOTCAR
            </span>
            <span className="text-xs text-muted-foreground dark:text-[#B4B5B1] font-medium">
              관리자 패널
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-[#1B1C1B]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 dark:text-[#B4B5B1]">
            메인 메뉴
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNav.map((item) => (
                <RecursiveMenuItem
                  key={item.title}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-muted/30 dark:bg-gray-800/30 dark:border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
