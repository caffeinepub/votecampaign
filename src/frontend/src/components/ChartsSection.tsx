import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PublicStats } from "../backend.d";
import { StepMarker } from "./StepMarker";

interface ChartsSectionProps {
  stats: PublicStats | undefined;
  isLoading: boolean;
}

const ISSUE_KEYS = ["Corruption", "Health", "Education", "Youth"] as const;
const ISSUE_COLORS = ["#dc2626", "#16a34a", "#1d4ed8", "#9333ea"];

function SupportGauge({ pct }: { pct: number }) {
  const radius = 80;
  const stroke = 14;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        className="overflow-visible"
        role="img"
        aria-label={`Support rate: ${pct.toFixed(1)}%`}
      >
        {/* Background arc */}
        <path
          d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
          fill="none"
          stroke="oklch(0.890 0.020 248.0)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <path
          d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
          fill="none"
          stroke="oklch(0.465 0.168 246.0)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <text
          x="100"
          y="95"
          textAnchor="middle"
          style={{
            fontSize: 28,
            fontWeight: 800,
            fill: "oklch(0.267 0.072 244.0)",
          }}
        >
          {pct.toFixed(1)}%
        </text>
        <text
          x="100"
          y="115"
          textAnchor="middle"
          style={{ fontSize: 12, fill: "oklch(0.520 0.030 248.0)" }}
        >
          Support Rate
        </text>
      </svg>
      <p className="text-xs text-muted-foreground mt-1">
        Based on 10,000 voter goal
      </p>
    </div>
  );
}

export function ChartsSection({ stats, isLoading }: ChartsSectionProps) {
  const totalSupporters = stats ? Number(stats.totalSupporters) : 0;
  const pct = Math.min(100, (totalSupporters / 10000) * 100);

  const issueData = [
    { name: "Anti-Corruption", count: stats ? Number(stats.economyCount) : 0 },
    { name: "Healthcare", count: stats ? Number(stats.climateCount) : 0 },
    { name: "Education", count: stats ? Number(stats.healthCount) : 0 },
    { name: "Youth Rights", count: stats ? Number(stats.educationCount) : 0 },
  ];

  return (
    <section id="charts" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <StepMarker step={4} label="Campaign Statistics" />
        <div className="mb-8">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
            Live Campaign Data
          </h2>
          <p className="text-muted-foreground">
            Real-time insights from our supporters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Support gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-card border-border/60">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">
                  Overall Support Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 flex justify-center">
                {isLoading ? (
                  <Skeleton className="h-36 w-48" />
                ) : (
                  <SupportGauge pct={pct} />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Issue bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-card border-border/60">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">
                  Issue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-4">
                {isLoading ? (
                  <Skeleton className="h-44 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={issueData}
                      margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        cursor={{ fill: "oklch(0.967 0.006 248.0)" }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {issueData.map((entry, idx) => (
                          <Cell
                            key={entry.name}
                            fill={ISSUE_COLORS[idx % ISSUE_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { ISSUE_KEYS };
