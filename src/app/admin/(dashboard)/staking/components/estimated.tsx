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
import { useEffect } from "react";
import dayjs from "dayjs";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";

interface EstimatedFormData {
  reward: string;
  start: string;
  end: string;
}

export const AdminStakingEstimated = () => {
  const estimatedForm = useForm<EstimatedFormData>();

  const fetch = useAdminFetch();

  useEffect(() => {
    fetchEstimated();
  }, []);

  const fetchEstimated = () => {
    fetch(`/v1/stakings/status/estimated`).then((data) => {
      estimatedForm.reset({
        reward: data.annualRate,
        end: dayjs(new Date(data.endTime)).format("YYYY-MM-DDTHH:mm"),
        start: dayjs(new Date(data.startTime)).format("YYYY-MM-DDTHH:mm"),
      });
    });
  };

  const onEstimatedSubmit = async (data: EstimatedFormData) => {
    fetch(`/v1/stakings/estimated/update`, {
      method: "POST",
      data: {
        rate: parseFloat(data.reward),
        startTime: dayjs(new Date(data.start)).toDate(),
        endTime: dayjs(new Date(data.end)).toDate(),
      },
    })
      .then(fetchEstimated)
      .catch((m) => alert(m));
  };

  return (
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
            <Input {...estimatedForm.register("reward")} type={"number"} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">시작일시</Label>
            <Input {...estimatedForm.register("start")} type="datetime-local" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">종료일시</Label>
            <Input {...estimatedForm.register("end")} type="datetime-local" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">저장하기</Button>
        </CardFooter>
      </Card>
    </form>
  );
};
