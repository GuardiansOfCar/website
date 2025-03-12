"use server";

import { createSession, deleteSession } from "@/app/lib/session";
import { API_BASE_URL } from "@/lib/constants";
import { redirect } from "next/navigation";

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

export async function login(data: any) {
  const res = await fetch(`${API_BASE_URL}/v1/auth/login/admin`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      nickname: data.email,
      password: data.password,
    }),
  });

  if (res.status >= 300) {
    return {
      message: "아이디와 비밀번호를 다시 확인해 주세요.",
    };
  }
  const payload = await res.json();
  await createSession(payload.token, payload.profile);
  redirect("/admin/staking");
}
