import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { CampaignFooter } from "../components/CampaignFooter";
import { CampaignHeader } from "../components/CampaignHeader";
import { ChartsSection } from "../components/ChartsSection";
import { DonationSection } from "../components/DonationSection";
import { HeroSection } from "../components/HeroSection";
import { PledgeForm } from "../components/PledgeForm";
import { ShareSection } from "../components/ShareSection";
import { StatsSection } from "../components/StatsSection";
import { StorytellingSection } from "../components/StorytellingSection";
import { SurveySection } from "../components/SurveySection";
import { usePublicStats } from "../hooks/useQueries";

export function HomePage() {
  const [supporterId, setSupporterId] = useState<bigint | null>(null);
  const { data: stats, isLoading: statsLoading } = usePublicStats();

  return (
    <div className="min-h-screen bg-background">
      <CampaignHeader />
      <main>
        <HeroSection />
        <StorytellingSection />
        <StatsSection stats={stats} isLoading={statsLoading} />
        <DonationSection />
        <div className="bg-muted/30">
          <PledgeForm onPledgeSuccess={(id) => setSupporterId(id)} />
        </div>
        <SurveySection supporterId={supporterId} />
        <div className="bg-muted/30">
          <ChartsSection stats={stats} isLoading={statsLoading} />
        </div>
        <ShareSection />
      </main>
      <CampaignFooter />
      <Toaster />
    </div>
  );
}
