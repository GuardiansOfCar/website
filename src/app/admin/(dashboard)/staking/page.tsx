"use client";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { DataTable } from "@/components/data-table";
import { API_BASE_URL } from "@/lib/constants";
import { useContext, useEffect } from "react";
import dayjs from "dayjs";
import { TokenContext } from "@/app/admin/(dashboard)/provider";
import { Underkdollar } from "@/components/underkdollar";
import { SettlementSelect } from "@/components/settlement-select";

interface EstimatedFormData {
  reward: string;
  start: string;
  end: string;
}

export default function AdminStaking() {
  const estimatedForm = useForm<EstimatedFormData>();
  const token = useContext(TokenContext);
  useEffect(() => {
    fetchEstimated();
  }, []);

  const fetchEstimated = () => {
    fetch(`${API_BASE_URL}/v1/stakings/status/estimated`).then(async (res) => {
      const data = await res.json();
      estimatedForm.reset({
        reward: data.annualRate,
        end: dayjs(new Date(data.endTime)).format("YYYY-MM-DDTHH:mm"),
        start: dayjs(new Date(data.startTime)).format("YYYY-MM-DDTHH:mm"),
      });
    });
  };

  const onEstimatedSubmit = async (data: EstimatedFormData) => {
    const res = await fetch(`${API_BASE_URL}/v1/stakings/estimated/update`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        rate: data.reward,
        startTime: dayjs(new Date(data.start)).toDate(),
        endTime: dayjs(new Date(data.end)).toDate(),
      }),
    });

    if (res.status >= 300) {
      return alert("다시 시도해 주세요.");
    }
    fetchEstimated();
  };
  console.log(typeof estimatedForm.watch("start"));
  return (
    <main className={"mx-auto p-10 flex flex-col w-full"}>
      <h1 className={"text-2xl font-bold"}>스테이킹 관리</h1>
      <Separator className={"my-4"} />

      <div className={"flex flex-col space-y-10"}>
        <div className={"grid grid-cols-2 gap-5"}>
          <div className={"flex flex-col space-y-4"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  총 스테이킹 수량
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
              </CardContent>
            </Card>
            <div className={"grid grid-cols-2 gap-4"}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    미지급 Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                </CardContent>
              </Card>
            </div>
          </div>
          <form onSubmit={estimatedForm.handleSubmit(onEstimatedSubmit)}>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Estimated 설정</CardTitle>
                <CardDescription>요율과 기간을 설정해 주세요</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Separator />

                <div className="grid gap-2">
                  <Label htmlFor="email">요율</Label>
                  <Input
                    {...estimatedForm.register("reward")}
                    type={"number"}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">시작일시</Label>
                  <Input
                    {...estimatedForm.register("start")}
                    type="datetime-local"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">종료일시</Label>
                  <Input
                    {...estimatedForm.register("end")}
                    type="datetime-local"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">저장하기</Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <DataTable
          title={"스테이킹 목록"}
          data={[]}
          columns={[]}
          toolbar={
            <>
              <Underkdollar value={true} setValue={() => {}} />
              <SettlementSelect />
            </>
          }
        />
      </div>
    </main>
  );
}
