import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useSubmitSurvey } from "../hooks/useQueries";
import { StepMarker } from "./StepMarker";

const ISSUE_OPTIONS = [
  { value: "Corruption", label: "⚖️ Anti-Corruption" },
  { value: "Health", label: "🏥 Healthcare for All" },
  { value: "Education", label: "📚 Better Education" },
  { value: "Youth", label: "👶 Youth & Women's Rights" },
];

interface SurveySectionProps {
  supporterId: bigint | null;
}

export function SurveySection({ supporterId }: SurveySectionProps) {
  const [topIssue, setTopIssue] = useState("");
  const [wouldVolunteer, setWouldVolunteer] = useState<"yes" | "no" | "">("");
  const [wouldDonate, setWouldDonate] = useState<"yes" | "no" | "">("");
  const [shareReason, setShareReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const submitSurvey = useSubmitSurvey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporterId) return;
    if (!topIssue || !wouldVolunteer || !wouldDonate) {
      setFormError("Please answer all required questions.");
      return;
    }
    setFormError("");
    const result = await submitSurvey.mutateAsync({
      supporterId,
      topIssue,
      wouldVolunteer: wouldVolunteer === "yes",
      wouldDonate: wouldDonate === "yes",
      shareReason: shareReason.trim(),
    });
    if (result.__kind__ === "ok") {
      setSuccess(true);
      setTimeout(() => {
        document
          .getElementById("charts")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    } else {
      setFormError(result.value);
    }
  };

  const isLocked = !supporterId;

  if (success) {
    return (
      <section id="survey" className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <StepMarker step={3} label="Support Survey" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            data-ocid="survey.success_state"
          >
            <Card className="max-w-lg mx-auto text-center shadow-card border-green-200 bg-green-50">
              <CardContent className="pt-10 pb-10">
                <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
                <h3 className="font-display font-bold text-2xl text-green-800 mb-2">
                  Survey Submitted!
                </h3>
                <p className="text-green-700 text-sm">
                  Thank you for sharing your views. Your feedback helps shape
                  our campaign priorities.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="survey" className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <StepMarker step={3} label="Support Survey" />
        <div className="mb-8">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
            Support Survey
          </h2>
          <p className="text-muted-foreground">
            Help us understand what matters most to our supporters.
          </p>
        </div>

        {isLocked ? (
          <Card
            className="max-w-lg border-dashed border-2 border-border shadow-none"
            data-ocid="survey.card"
          >
            <CardContent className="pt-8 pb-8 text-center">
              <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                Pledge First
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Please pledge your vote above to unlock the survey.
              </p>
              <Button
                variant="outline"
                asChild
                className="border-orange text-orange hover:bg-orange hover:text-white"
                data-ocid="survey.secondary_button"
              >
                <a href="#pledge">Go to Pledge Form</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card
            className="max-w-2xl shadow-card border-border/60"
            data-ocid="survey.card"
          >
            <CardContent className="pt-6 pb-6">
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-8">
                  {/* Top issue */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      What is your top issue?{" "}
                      <span className="text-destructive">*</span>
                    </h3>
                    <p className="text-muted-foreground text-xs mb-4">
                      Select the issue you care most about.
                    </p>
                    <RadioGroup
                      value={topIssue}
                      onValueChange={setTopIssue}
                      className="space-y-2"
                      data-ocid="survey.radio"
                    >
                      {ISSUE_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-campaign-blue hover:bg-primary/5 cursor-pointer transition-colors"
                        >
                          <RadioGroupItem
                            value={opt.value}
                            id={`issue-${opt.value}`}
                            className="text-campaign-blue"
                          />
                          <Label
                            htmlFor={`issue-${opt.value}`}
                            className="cursor-pointer font-medium text-sm"
                          >
                            {opt.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Volunteer */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Would you volunteer?{" "}
                      <span className="text-destructive">*</span>
                    </h3>
                    <RadioGroup
                      value={wouldVolunteer}
                      onValueChange={(v) =>
                        setWouldVolunteer(v as "yes" | "no")
                      }
                      className="flex gap-4"
                      data-ocid="survey.radio"
                    >
                      {["yes", "no"].map((v) => (
                        <div
                          key={v}
                          className="flex items-center gap-2 p-3 pr-5 rounded-lg border border-border/60 hover:border-campaign-blue hover:bg-primary/5 cursor-pointer transition-colors"
                        >
                          <RadioGroupItem value={v} id={`volunteer-${v}`} />
                          <Label
                            htmlFor={`volunteer-${v}`}
                            className="cursor-pointer font-medium text-sm capitalize"
                          >
                            {v === "yes" ? "✅ Yes" : "❌ No"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Donate */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Would you donate?{" "}
                      <span className="text-destructive">*</span>
                    </h3>
                    <RadioGroup
                      value={wouldDonate}
                      onValueChange={(v) => setWouldDonate(v as "yes" | "no")}
                      className="flex gap-4"
                      data-ocid="survey.radio"
                    >
                      {["yes", "no"].map((v) => (
                        <div
                          key={v}
                          className="flex items-center gap-2 p-3 pr-5 rounded-lg border border-border/60 hover:border-campaign-blue hover:bg-primary/5 cursor-pointer transition-colors"
                        >
                          <RadioGroupItem value={v} id={`donate-${v}`} />
                          <Label
                            htmlFor={`donate-${v}`}
                            className="cursor-pointer font-medium text-sm capitalize"
                          >
                            {v === "yes" ? "✅ Yes" : "❌ No"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Share reason */}
                  <div>
                    <Label
                      htmlFor="share-reason"
                      className="font-semibold text-sm mb-1.5 block"
                    >
                      Why do you support this campaign?
                    </Label>
                    <Textarea
                      id="share-reason"
                      placeholder="Share your story and what motivates you to support this campaign..."
                      value={shareReason}
                      onChange={(e) => setShareReason(e.target.value)}
                      className="min-h-[100px] resize-none"
                      data-ocid="survey.textarea"
                    />
                  </div>

                  {formError && (
                    <p
                      className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3"
                      data-ocid="survey.error_state"
                    >
                      {formError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={submitSurvey.isPending}
                    className="w-full h-12 bg-orange hover:bg-orange-dark text-white font-bold uppercase tracking-widest text-sm shadow-md"
                    data-ocid="survey.submit_button"
                  >
                    {submitSurvey.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit My Survey"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
