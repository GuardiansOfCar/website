import { redirect } from "next/navigation";

export default function AdminDashboard() {
  // admin 로그인 시 바로 스테이킹 관리 페이지로 리다이렉트
  redirect("/admin/staking");
}
