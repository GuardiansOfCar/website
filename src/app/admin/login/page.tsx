"use client";

import { Metadata } from "next";
import { LoginForm, LoginFormData } from "@/components/login-form";
import { API_BASE_URL } from "@/lib/constants";

export default function AdminLoginPage() {
  const handleSubmit = async (data: LoginFormData) => {
    const res = await fetch(`${API_BASE_URL}/v1/auth/login/admin`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        nickname: data.email,
        password: data.password,
      }),
    });

    if (res.status >= 300) {
      return alert("아이디와 비밀번호를 다시 확인해 주세요.");
    }
    const payload = await res.json();
    console.log(payload);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm rootRef={{}} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
