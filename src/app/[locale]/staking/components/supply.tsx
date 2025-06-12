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
      { d: "2025-12", s: 6000000000 },
      { d: "2026-01", s: 6100000000 },
      { d: "2026-02", s: 6200000000 },
      { d: "2026-03", s: 6300000000 },
      { d: "2026-04", s: 6400000000 },
      { d: "2026-05", s: 6500000000 },
      { d: "2026-06", s: 6600000000 },
      { d: "2026-07", s: 6700000000 },
      { d: "2026-08", s: 6800000000 },
      { d: "2026-09", s: 6900000000 },
      { d: "2026-10", s: 7000000000 },
      { d: "2026-11", s: 7100000000 },
      { d: "2026-12", s: 7200000000 },
      { d: "2027-01", s: 7300000000 },
      { d: "2027-02", s: 7400000000 },
      { d: "2027-03", s: 7500000000 },
      { d: "2027-04", s: 7600000000 },
      { d: "2027-05", s: 7700000000 },
      { d: "2027-06", s: 7800000000 },
      { d: "2027-07", s: 7900000000 },
      { d: "2027-08", s: 8000000000 },
      { d: "2027-09", s: 8100000000 },
      { d: "2027-10", s: 8200000000 },
      { d: "2027-11", s: 8300000000 },
      { d: "2027-12", s: 8400000000 },
      { d: "2028-01", s: 8500000000 },
      { d: "2028-02", s: 8600000000 },
      { d: "2028-03", s: 8700000000 },
      { d: "2028-04", s: 8800000000 },
      { d: "2028-05", s: 8900000000 },
      { d: "2028-06", s: 9000000000 },
      { d: "2028-07", s: 9100000000 },
      { d: "2028-08", s: 9200000000 },
      { d: "2028-09", s: 9300000000 },
      { d: "2028-10", s: 9400000000 },
      { d: "2028-11", s: 9500000000 },
      { d: "2028-12", s: 9600000000 },
      { d: "2029-01", s: 9700000000 },
      { d: "2029-02", s: 9800000000 },
      { d: "2029-03", s: 9900000000 },
      { d: "2029-04", s: 10000000000 },
    ],
    [],
  );

  return (
    <div
      className={
        "border-neutral-0 border-4 bg-neutral-100 p-9 flex flex-col space-y-6 min-w-[994px]"
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
