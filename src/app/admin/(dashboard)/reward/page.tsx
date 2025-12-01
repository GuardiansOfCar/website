"use client";

import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { listRequest } from "@/app/admin/(dashboard)/lib/api";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { useAdminFetch } from "@/app/admin/(dashboard)/lib/use-admin-fetch";
import { useMemo } from "react";
import { DataTablePagination } from "@/components/data-table-pagination";
import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminReward() {
  const searchParams = useSearchParams();

  const request = useMemo(
    () => ({
      ...listRequest,
      ...Object.fromEntries(searchParams.entries()),
    }),
    [searchParams.entries()],
  );

  const fetch = useAdminFetch();
  const router = useRouter();

  const listStakings = useSWR([`/rewards/list`, request], (args) =>
    fetch(args[0], { query: args[1] }),
  );

  return (
    <main className={"mx-auto p-4 md:p-6 lg:p-10 flex flex-col w-full"}>
      <div className={"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"}>
        <h1 className={"text-xl md:text-2xl font-bold"}>보너스 요율 관리</h1>
        <Link href={"/admin/reward/create"}>
          <Button className="w-full sm:w-auto">등록</Button>
        </Link>
      </div>
      <Separator className={"my-4"} />

      <div className={"flex flex-col space-y-6 md:space-y-10"}>
        <DataTable
          onRowClick={(x) => router.push(`/admin/reward/${(x as any).id}`)}
          title={""}
          total={listStakings.data?.total || 0}
          data={listStakings.data?.data ?? []}
          columns={[
            { accessorKey: "type", header: "유형" },
            { accessorKey: "text", header: "문구" },
            { accessorKey: "rate", header: "요율" },
          ]}
        />
        <DataTablePagination
          request={request}
          total={listStakings.data?.total || 0}
        />
      </div>
    </main>
  );
}
