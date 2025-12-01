"use client";

import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { useEffect } from "react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Values {
  text: string;
  dollar_standard: number;
  rate: number;
  type: "PURCHASE" | "REF" | "REFERED";
}

export default function AdminRewardId() {
  const { id } = useParams();
  const isCreate = id === "create";
  const fetch = useAdminFetch();

  const rewardDetail = useSWR([`/rewards/detail/${id}`], (args) =>
    fetch(args[0]),
  );

  const form = useForm<Values>({
    defaultValues: {
      text: "",
      dollar_standard: 0,
      rate: 0,
      type: "PURCHASE",
    },
  });

  useEffect(() => {
    if (rewardDetail.data) {
      form.reset(rewardDetail.data);
    }
  }, [rewardDetail.data]);

  const router = useRouter();
  const onSubmit = (data: Values) => {
    fetch(`/rewards/${isCreate ? "create" : "update"}`, {
      method: isCreate ? "POST" : "PUT",
      data: {
        rate: parseFloat(data.rate as any),
        type: data.type,
        dollar_standard:
          data.type === "PURCHASE" ? parseInt(data.dollar_standard as any) : 0,
        text: data.text,
        rewardId: isCreate ? undefined : parseInt(id as any),
      },
    })
      .then(() => {
        alert("저장되었습니다.")
        router.back();
      })
      .catch((e) => {
        alert("실패했습니다. 다시 시도해 주세요.");
      });
  };

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      fetch(`/rewards/${id}`, { method: "DELETE" })
        .then(router.back)
        .catch(() => {
          alert("삭제 실패했습니다. 다시 시도해 주세요.");
        });
    }
  };
  const type = form.watch("type");
  return (
    <main className={"mx-auto p-10 flex flex-col w-full"}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-2xl font-bold"}>
          보너스 요율 {isCreate ? "등록" : "상세"}
        </h1>
        <Button variant={"secondary"} onClick={handleDelete}>
          삭제
        </Button>
      </div>
      <Separator className={"my-4"} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 w-[400px]">
          <div className="grid gap-2">
            <Label htmlFor="text">유형</Label>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="h-8 ">
                    <SelectValue placeholder={field.value} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {["PURCHASE", "REF", "REFERED"].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              name={"type"}
              control={form.control}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">문구</Label>
            <Input {...form.register("text")} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">요율</Label>
            <Input {...form.register("rate")} required />
          </div>

          {type === "PURCHASE" && (
            <div className="grid gap-2">
              <Label htmlFor="text">달러 기준</Label>
              <Input
                {...form.register("dollar_standard")}
                required
                type={"number"}
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            저장
          </Button>
        </div>
      </form>
    </main>
  );
}
