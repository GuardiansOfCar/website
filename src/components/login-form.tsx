"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";

export interface LoginFormData {
  email: string;
  password: string;
}

// @ts-ignore
export function LoginForm({
  rootRef,
  pending,
  onSubmit,
}: {
  pending?: boolean;
  onSubmit: SubmitHandler<LoginFormData>;
  rootRef?: React.ComponentProps<"div">;
}) {
  const form = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });
  return (
    <div className={cn("flex flex-col gap-6", rootRef?.className)} {...rootRef}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">고카 관리자 로그인</CardTitle>
          <CardDescription>아이디를 입력해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">아이디</Label>
                <Input {...form.register("email")} required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input
                  {...form.register("password")}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <Button disabled={pending} type="submit" className="w-full">
                로그인
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
