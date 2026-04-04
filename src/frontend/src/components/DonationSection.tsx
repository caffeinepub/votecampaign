import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { motion } from "motion/react";
import { StepMarker } from "./StepMarker";

export function DonationSection() {
  return (
    <section id="donate" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <StepMarker step={1} label="Support the Campaign" />
        <div className="mb-8">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
            Donate to the Campaign
          </h2>
          <p className="text-muted-foreground">
            Your financial support fuels our grassroots movement. Every
            contribution makes a difference.
          </p>
        </div>

        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-sm mx-auto"
        >
          <Card className="shadow-card border-orange/30 overflow-hidden">
            <div className="bg-gradient-to-r from-orange to-orange-dark px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">
                  Scan to Pay
                </h3>
                <p className="text-white/70 text-xs">Pay via UPI instantly</p>
              </div>
            </div>
            <CardContent className="pt-5 pb-5 bg-charcoal flex flex-col items-center justify-center">
              <div className="bg-white rounded-2xl p-3 shadow-lg mb-4">
                <img
                  src="/assets/image-019d5463-dfcf-72ee-a1aa-2b2c83f1cb55.png"
                  alt="UPI QR Code for DIGI NAZ"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <p className="text-white font-semibold text-sm text-center">
                Scan to Pay via UPI
              </p>
              <p className="text-white/50 text-xs text-center mt-1">
                Open any UPI app and scan the QR code above to donate
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
