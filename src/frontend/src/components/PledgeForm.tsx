import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { usePledgeSupport } from "../hooks/useQueries";
import { StepMarker } from "./StepMarker";

interface PledgeFormProps {
  onPledgeSuccess: (supporterId: bigint) => void;
}

export function PledgeForm({ onPledgeSuccess }: PledgeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState(false);

  const pledge = usePledgeSupport();

  const validate = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError("Please enter your full name.");
      valid = false;
    } else {
      setNameError("");
    }
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await pledge.mutateAsync({
      name: name.trim(),
      email: email.trim(),
    });
    if (result.__kind__ === "ok") {
      setSuccess(true);
      toast.success(
        "🎉 New supporter joined! Thank you for pledging your vote.",
      );
      onPledgeSuccess(result.value);
      setTimeout(() => {
        document
          .getElementById("survey")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }
  };

  if (success) {
    return (
      <section id="pledge" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <StepMarker step={2} label="Pledge Your Vote" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            data-ocid="pledge.success_state"
          >
            <Card className="max-w-lg mx-auto text-center shadow-card border-green-200 bg-green-50">
              <CardContent className="pt-10 pb-10">
                <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
                <h3 className="font-display font-bold text-2xl text-green-800 mb-2">
                  Pledge Received!
                </h3>
                <p className="text-green-700 text-sm">
                  Thank you, <strong>{name}</strong>! Your pledge is recorded.
                  Please complete the survey below.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="pledge" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <StepMarker step={2} label="Pledge Your Vote" />
        <div className="mb-8">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
            Pledge Your Vote
          </h2>
          <p className="text-muted-foreground">
            Join thousands of supporters by adding your pledge today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-card border-border/60">
            <CardContent className="pt-6 pb-6">
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                  <div>
                    <Label
                      htmlFor="pledge-name"
                      className="text-sm font-semibold mb-1.5 block"
                    >
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pledge-name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Jane Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`h-11 ${nameError ? "border-destructive" : ""}`}
                      data-ocid="pledge.input"
                    />
                    {nameError && (
                      <p
                        className="text-destructive text-xs mt-1.5 flex items-center gap-1"
                        data-ocid="pledge.name_error"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {nameError}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="pledge-email"
                      className="text-sm font-semibold mb-1.5 block"
                    >
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pledge-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`h-11 ${emailError ? "border-destructive" : ""}`}
                      data-ocid="pledge.input"
                    />
                    {emailError && (
                      <p
                        className="text-destructive text-xs mt-1.5 flex items-center gap-1"
                        data-ocid="pledge.email_error"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {pledge.isError && (
                    <div
                      className="bg-destructive/10 border border-destructive/20 rounded-lg p-3"
                      data-ocid="pledge.error_state"
                    >
                      <p className="text-destructive text-sm">
                        {pledge.error instanceof Error
                          ? pledge.error.message
                          : "An error occurred. Please try again."}
                      </p>
                    </div>
                  )}

                  {pledge.data?.__kind__ === "err" && (
                    <div
                      className="bg-destructive/10 border border-destructive/20 rounded-lg p-3"
                      data-ocid="pledge.error_state"
                    >
                      <p className="text-destructive text-sm">
                        {pledge.data.value}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={pledge.isPending}
                    className="w-full h-12 bg-orange hover:bg-orange-dark text-white font-bold uppercase tracking-widest text-sm shadow-md"
                    data-ocid="pledge.submit_button"
                  >
                    {pledge.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "🗳️ Pledge Now"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Why pledge */}
          <div className="space-y-4">
            {[
              {
                emoji: "✅",
                title: "Your voice matters",
                desc: "Every pledge represents a real person committed to change.",
              },
              {
                emoji: "🔒",
                title: "Secure & private",
                desc: "Your data is stored safely on the Internet Computer blockchain.",
              },
              {
                emoji: "📊",
                title: "Track our progress",
                desc: "Watch real-time stats grow as our movement strengthens.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-4 bg-white rounded-xl border border-border/60 shadow-xs"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
