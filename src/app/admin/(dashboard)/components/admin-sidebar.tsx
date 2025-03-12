"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {Button} from "@/components/ui/button";
import {logout} from "@/app/actions/auth";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "ICO 관리",
      url: "/admin",
      items: [
        {
          title: "스테이킹 관리",
          url: "/staking",
        },
        {
          title: "리퍼럴 관리",
          url: "/referral",
        },
        {
          title: "판매 관리",
          url: "/sales",
        },
        {
          title: "보너스 요율 관리",
          url: "/reward",
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className={"text-lg px-2 pt-3 font-medium"}>GOCAR 관리자</h1>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((nav) => (
          <SidebarGroup key={nav.title}>
            <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(nav.url + item.url)}
                    >
                      <a href={nav.url + item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <Button className={"m-5 mt-auto bg-neutral-30"}  onClick={logout}>로그아웃</Button>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
