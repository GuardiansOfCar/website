import { redirect } from "next/navigation";

export default function V2RootPage() {
  // 기본 locale로 리다이렉트
  redirect("/v2/en");
}

