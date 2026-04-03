import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiX } from "react-icons/si";
import { StepMarker } from "./StepMarker";

export function ShareSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    "Join VOICE 2026 — fighting corruption, demanding healthcare for kids & women, and better education for all youth. Add your voice!",
  );
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <section id="share" className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <StepMarker step={5} label="Spread the Word" />
        <div className="mb-8">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
            Spread the Word
          </h2>
          <p className="text-muted-foreground">
            Help us grow the movement. Share with friends and family.
          </p>
        </div>

        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-navy to-campaign-blue rounded-2xl p-6 md:p-8 text-white mb-6">
            <Share2 className="w-8 h-8 text-orange mb-3" />
            <h3 className="font-display font-bold text-xl mb-1">
              Your Share Can Change Lives
            </h3>
            <p className="text-white/75 text-sm">
              Every share brings us closer to our goal of 10,000 pledges. Use
              the buttons below to spread the word.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 h-11 bg-[#1877F2] hover:bg-[#1565D8] text-white font-semibold"
              asChild
              data-ocid="share.primary_button"
            >
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiFacebook className="w-4 h-4 mr-2" />
                Facebook
              </a>
            </Button>

            <Button
              className="flex-1 h-11 bg-black hover:bg-neutral-800 text-white font-semibold"
              asChild
              data-ocid="share.secondary_button"
            >
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiX className="w-3.5 h-3.5 mr-2" />
                Share on X
              </a>
            </Button>

            <Button
              variant="outline"
              className="flex-1 h-11 border-border"
              onClick={handleCopy}
              data-ocid="share.secondary_button"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
