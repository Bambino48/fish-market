"use client";

import { ReactNode } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

type ChartPoint = {
  value: number;
  label?: string;
};

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  chartData?: ChartPoint[];
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  chartData = [],
  trend,
}: StatCardProps) {
  const hasChart = chartData.length > 0;

  const trendStyles =
    trend?.direction === "up"
      ? "bg-emerald-50 text-emerald-700"
      : trend?.direction === "down"
        ? "bg-red-50 text-red-700"
        : "bg-slate-100 text-slate-700";

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            {icon}
          </div>
        )}
      </div>

      {(trend || hasChart) && (
        <div className="mt-5 space-y-4">
          {trend && (
            <div className="flex items-center justify-between gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${trendStyles}`}
              >
                {trend.direction === "up" && <TrendingUp className="h-3.5 w-3.5" />}
                {trend.direction === "down" && <TrendingDown className="h-3.5 w-3.5" />}
                {trend.value}
              </span>

              {trend.label && (
                <span className="text-xs text-slate-400">{trend.label}</span>
              )}
            </div>
          )}

          {hasChart && (
            <div className="h-24 w-full overflow-hidden rounded-2xl bg-slate-50 px-2 py-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      background: "#ffffff",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#64748b" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="currentColor"
                    fill="currentColor"
                    className="text-sky-600"
                    fillOpacity={0.12}
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}