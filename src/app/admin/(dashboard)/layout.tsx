import { PropsWithChildren } from "react";
import { AdminSidebar } from "@/app/admin/(dashboard)/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AdminProvider from "@/app/admin/(dashboard)/provider";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header></header>
        <AdminProvider token={session || ""}>{children}</AdminProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
