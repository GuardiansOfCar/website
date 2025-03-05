import { useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Cell,
} from "recharts";
import { useMemo } from "react";
import dayjs from "dayjs";

export const StakingSupply = () => {
  const t = useTranslations();

  const data = useMemo(
    () => [
      { d: "2025-04", s: 26000000000 },
      { d: "2025-05", s: 26400000000 },
      { d: "2025-06", s: 26800000000 },
      { d: "2025-07", s: 27200000000 },
      { d: "2025-08", s: 27600000000 },
      { d: "2025-09", s: 28000000000 },
      { d: "2025-10", s: 28400000000 },
      { d: "2025-11", s: 28800000000 },
      { d: "2025-12", s: 29200000000 },
      { d: "2026-01", s: 29600000000 },
      { d: "2026-02", s: 30000000000 },
      { d: "2026-03", s: 30400000000 },
      { d: "2026-04", s: 30800000000 },
      { d: "2026-05", s: 31200000000 },
      { d: "2026-06", s: 31600000000 },
      { d: "2026-07", s: 32000000000 },
      { d: "2026-08", s: 32400000000 },
      { d: "2026-09", s: 32800000000 },
      { d: "2026-10", s: 33200000000 },
      { d: "2026-11", s: 33600000000 },
      { d: "2026-12", s: 34000000000 },
      { d: "2027-01", s: 34400000000 },
      { d: "2027-02", s: 34800000000 },
      { d: "2027-03", s: 35200000000 },
      { d: "2027-04", s: 35600000000 },
      { d: "2027-05", s: 36000000000 },
      { d: "2027-06", s: 36400000000 },
      { d: "2027-07", s: 36800000000 },
      { d: "2027-08", s: 37200000000 },
      { d: "2027-09", s: 37600000000 },
      { d: "2027-10", s: 38000000000 },
      { d: "2027-11", s: 38400000000 },
      { d: "2027-12", s: 38800000000 },
      { d: "2028-01", s: 39200000000 },
      { d: "2028-02", s: 39600000000 },
      { d: "2028-03", s: 40000000000 },
    ],
    [],
  );

  return (
    <div
      className={
        "border-neutral-0 border-4 bg-neutral-100 p-9 flex flex-col space-y-6"
      }
    >
      <p className={"text-header-3"}>TOTAL SUPPLY</p>
      <div className={"self-stretch  h-[386px]"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ bottom: 60, left: 30 }}>
            <CartesianGrid
              strokeDasharray="0"
              stroke={"#cecece"}
              vertical={false}
            />
            <XAxis
              dataKey="d"
              axisLine={false}
              angle={-90}
              tick={{
                textAnchor: "end",
                fill: "#000",
                fontSize: 12,
                fontWeight: "500",
              }}
              label={{
                value: "Month",
                position: "bottom",
                offset: 50,
                fontSize: 14,
                fill: "#000",
                fontWeight: "bold",
              }}
            />
            <YAxis
              axisLine={false}
              tick={{
                fill: "#000",
                fontSize: 12,
                fontWeight: "500",
              }}
              label={{
                angle: -90,
                value: "Supply",
                position: "left",
                offset: 10,
                fontSize: 14,
                fill: "#000",
                fontWeight: "bold",
              }}
              tickFormatter={(value) => `${value / 1000000000}B`}
            />
            <Bar height={280} dataKey="s">
              {data.map((entry, index) => (
                <Cell
                  key={entry.s}
                  fill={
                    dayjs().format("YYYY-MM") === entry.d
                      ? "#21F1EC"
                      : "#D9D9D9"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
