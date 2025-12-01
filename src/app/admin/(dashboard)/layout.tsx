import { PropsWithChildren } from "react";
import { AdminSidebar } from "@/app/admin/(dashboard)/components/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AdminProvider from "@/app/admin/(dashboard)/provider";
import { decrypt } from "@/lib/session";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/app/admin/(dashboard)/contexts/theme-context";
import { ThemeToggle } from "@/app/admin/(dashboard)/components/theme-toggle";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const { token } = (await decrypt(session))!!;

  return (
    <ThemeProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-2 md:px-4 bg-white dark:bg-black">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
            <div className="flex items-center gap-2 flex-1">
              <h1 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">
                관리자 대시보드
              </h1>
            </div>
            <ThemeToggle />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-2 md:p-4 bg-white dark:bg-black">
            <AdminProvider token={token || ""}>{children}</AdminProvider>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
