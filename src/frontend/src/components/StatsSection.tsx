import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { HandHeart, Star, Users } from "lucide-react";
import { motion } from "motion/react";
import type { PublicStats } from "../backend.d";
import { StepMarker } from "./StepMarker";

const SUPPORTERS_GOAL = 10000;
const PLEDGES_GOAL = 8000;
const VOLUNTEERS_GOAL = 2000;

function StatCard({
  icon,
  label,
  value,
  goal,
  color,
  index,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  goal: number;
  color: string;
  index: number;
  isLoading: boolean;
}) {
  const pct = Math.min(100, (value / goal) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      data-ocid="stats.card"
    >
      <Card className="shadow-card border-border/60 hover:shadow-card-hover transition-shadow duration-300">
        <CardContent className="pt-6 pb-5 px-5">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
            >
              {icon}
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <span className="font-display font-extrabold text-2xl text-foreground">
                {value.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm font-medium mb-3">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="h-2 w-full rounded-full" />
          ) : (
            <div>
              <Progress value={pct} className="h-2 rounded-full" />
              <p className="text-xs text-muted-foreground mt-1.5">
                {pct.toFixed(1)}% of {goal.toLocaleString()} goal
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatsSectionProps {
  stats: PublicStats | undefined;
  isLoading: boolean;
}

export function StatsSection({ stats, isLoading }: StatsSectionProps) {
  const totalSupporters = stats ? Number(stats.totalSupporters) : 0;
  const totalVolunteers = stats ? Number(stats.totalVolunteers) : 0;

  return (
    <section id="progress" className="py-16 px-4" data-ocid="stats.section">
      <div className="max-w-5xl mx-auto">
        <StepMarker step={1} label="Campaign Progress" />
        <div className="mb-8">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
            Our Progress
          </h2>
          <p className="text-muted-foreground">
            Real-time stats from our growing movement.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          data-ocid="stats.list"
        >
          <StatCard
            icon={<Users className="w-5 h-5 text-white" />}
            label="Voices Joined"
            value={totalSupporters}
            goal={SUPPORTERS_GOAL}
            color="bg-campaign-blue"
            index={0}
            isLoading={isLoading}
          />
          <StatCard
            icon={<Star className="w-5 h-5 text-white" />}
            label="Pledges Made"
            value={totalSupporters}
            goal={PLEDGES_GOAL}
            color="bg-orange"
            index={1}
            isLoading={isLoading}
          />
          <StatCard
            icon={<HandHeart className="w-5 h-5 text-white" />}
            label="Volunteers Ready"
            value={totalVolunteers}
            goal={VOLUNTEERS_GOAL}
            color="bg-green-600"
            index={2}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
