"use client";

import { LoginForm, LoginFormData } from "@/components/login-form";
import { login } from "@/app/actions/auth";
import { useTransition } from "react";

export default function AdminLoginPage() {
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const response = await login(data);
      if (response) {
        alert(response.message);
      }
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm pending={isPending} rootRef={{}} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
