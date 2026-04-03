import { Button } from "@/components/ui/button";
import { ChevronDown, Users } from "lucide-react";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.267 0.072 244.0) 0%, oklch(0.465 0.168 246.0) 60%, oklch(0.438 0.158 246.0) 100%)",
      }}
    >
      {/* Hero image overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/campaign-hero.dim_1200x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,42,78,0.55) 0%, rgba(11,42,78,0.3) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-20 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-8 text-sm font-medium border border-white/20">
            <Users className="w-4 h-4 text-orange" />
            <span>Join the Movement for Change</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-tight tracking-tight mb-6">
            Fight Corruption.
            <br />
            Heal Our Future.
            <br />
            <span className="text-orange">Educate Our Youth.</span>
          </h1>

          <p className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            We stand against corruption, fight for healthcare for our children,
            women, and youth, and demand better education for every child.
            Pledge your voice today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-orange hover:bg-orange-dark text-white font-bold uppercase tracking-widest px-8 py-6 text-base shadow-xl w-full sm:w-auto"
              asChild
              data-ocid="hero.primary_button"
            >
              <a href="#pledge">🗳️ Pledge Your Vote</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/60 text-white hover:bg-white/10 hover:border-white font-semibold uppercase tracking-wider px-8 py-6 text-base bg-transparent w-full sm:w-auto"
              asChild
              data-ocid="hero.secondary_button"
            >
              <a href="#progress">Learn More</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-7 h-7 text-white/50" />
        </motion.div>
      </div>
    </section>
  );
}
