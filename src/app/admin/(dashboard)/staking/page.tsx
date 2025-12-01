"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StakingOverview } from "@/app/admin/(dashboard)/staking/components/staking-overview";
import { RewardClaimApproval } from "@/app/admin/(dashboard)/staking/components/reward-claim-approval";
import { UnstakingManagement } from "@/app/admin/(dashboard)/staking/components/unstaking-management";

export default function AdminStaking() {
  return (
    <main
      className={"mx-auto p-4 md:p-6 lg:p-10 flex flex-col w-full bg-white dark:bg-black"}
    >
      <h1 className={"text-xl md:text-2xl font-bold text-gray-900 dark:text-white"}>
        스테이킹 관리
      </h1>
      <Separator className={"my-4 border-gray-200 dark:border-gray-700"} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6 overflow-x-auto">
          <TabsTrigger value="overview" className="text-xs md:text-sm">스테이킹 현황</TabsTrigger>
          <TabsTrigger value="claim" className="text-xs md:text-sm">리워드 클레임 승인</TabsTrigger>
          <TabsTrigger value="unstaking" className="text-xs md:text-sm">언스테이킹 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StakingOverview />
        </TabsContent>

        <TabsContent value="claim">
          <RewardClaimApproval />
        </TabsContent>

        <TabsContent value="unstaking">
          <UnstakingManagement />
        </TabsContent>
      </Tabs>
    </main>
  );
}
