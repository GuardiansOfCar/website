"use client";

import { Separator } from "@/components/ui/separator";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface Values {
  solana_address: string;
  ico_address: string;
  ico_network: "SOL" | "ETH" | "BNB";
  ico_token_symbol: "SOL" | "ETH" | "BNB" | "USDT";
  icoAmount: number;
  gocarAmount: number;
  ico_type: "PUBLIC" | "PRIVATE";
  lock_release_date: string;
}

export default function AdminSalesId() {
  const { id } = useParams();
  const isCreate = id === "create";
  const fetch = useAdminFetch();
  const sp = useSearchParams();
  const sid = sp.get("sid") as string;

  const rewardDetail = useSWR(
    isCreate ? null : [`/v1/icosales/participate/detail/${sid}`],
    (args) => fetch(args[0]),
  );

  const form = useForm<Values>({
    defaultValues: {
      solana_address: "",
      ico_address: "",
      ico_network: "ETH",
      ico_token_symbol: "ETH",
      icoAmount: 0,
      gocarAmount: 0,
      ico_type: "PRIVATE",
      lock_release_date: "",
    },
  });

  useEffect(() => {
    if (rewardDetail.data) {
      form.reset({
        solana_address: rewardDetail.data.solanaAddress,
        ico_address: rewardDetail.data.icoWalletAddress,
        ico_network: rewardDetail.data.icoNetwork,
        ico_token_symbol: rewardDetail.data.icoTokenSymbol,
        icoAmount: rewardDetail.data.amount,
        gocarAmount: rewardDetail.data.gocar_amount,
        ico_type: rewardDetail.data.icoType,
        lock_release_date: rewardDetail.data.lockReleaseDate
          ? dayjs(rewardDetail.data.lockReleaseDate).format("YYYY-MM-DDTHH:mm")
          : "",
      });
    }
  }, [rewardDetail.data]);

  const router = useRouter();

  const onSubmit = (data: Values) => {
    fetch(`/v1/icosales/private/${isCreate ? "create" : "update"}`, {
      method: isCreate ? "POST" : "PUT",
      data: {
        id: isCreate ? undefined : parseInt(sid as any),
        ...data,
        gocarAmount: parseFloat(data.gocarAmount as any),
        icoAmount: parseFloat(data.icoAmount as any),
        lock_release_date: dayjs(data.lock_release_date).utc().toISOString(),
      },
    })
      .then(() => {
        alert("저장되었습니다.");
        router.back();
      })
      .catch((e) => {
        if (e.code === 3) {
          alert("이미 참여한 지갑 주소입니다.");
        } else {
          alert("실패했습니다. 다시 시도해 주세요.");
        }
      });
  };

  const icoType = form.watch("ico_type");

  const isPublic = icoType === "PUBLIC";
  return (
    <main className={"mx-auto p-10 flex flex-col w-full"}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-2xl font-bold"}>
          ICO SALE {isCreate ? "등록" : "상세"}
        </h1>
      </div>
      <Separator className={"my-4"} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 w-[400px]">
          <div className="grid gap-2">
            <Label htmlFor="text">참여 지갑주소</Label>
            <Input
              {...form.register("ico_address")}
              required
              disabled={!isCreate || isPublic}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">참여 네트워크</Label>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!isCreate || isPublic}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="h-8 ">
                    <SelectValue placeholder={field.value} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {["SOL", "ETH", "BNB"].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              name={"ico_network"}
              control={form.control}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">참여 코인</Label>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!isCreate || isPublic}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="h-8 ">
                    <SelectValue placeholder={field.value} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {["SOL", "ETH", "BNB", "USDT"].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              name={"ico_token_symbol"}
              control={form.control}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">참여 토큰 수량</Label>
            <Input
              {...form.register("icoAmount")}
              required
              disabled={isPublic}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">솔라나 주소</Label>
            <Input
              {...form.register("solana_address")}
              required
              disabled={!isCreate || isPublic}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">구매 $GOTCAR 수량</Label>
            <Input
              {...form.register("gocarAmount")}
              required
              disabled={isPublic}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">참여 유형</Label>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="h-8 ">
                    <SelectValue placeholder={field.value} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {["PUBLIC", "PRIVATE"].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              name={"ico_type"}
              control={form.control}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">락업 해제 날짜</Label>
            <Input
              {...form.register("lock_release_date")}
              type={"datetime-local"}
              required
              disabled={isPublic}
            />
            <p className={"text-sm text-neutral-30"}>
              UTC 기준으로 설정해 주세요.
            </p>
          </div>

          {!isPublic && (
            <Button type="submit" className="w-full">
              저장
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}
