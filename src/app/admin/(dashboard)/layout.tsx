import { PropsWithChildren } from "react";
import { AdminSidebar } from "@/app/admin/(dashboard)/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AdminProvider from "@/app/admin/(dashboard)/provider";
import { decrypt } from "@/app/lib/session";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const { token } = (await decrypt(session))!!;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header></header>
        <AdminProvider token={token || ""}>{children}</AdminProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
