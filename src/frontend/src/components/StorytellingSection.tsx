import { AlertTriangle, Clock, Heart, TrendingUp, Users } from "lucide-react";
import { type Variants, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const STORY_TEXT = {
  child: "Aisha",
  age: 9,
  location: "a small town just like yours",
};

function CounterAnimation({
  start,
  end,
  duration = 2000,
}: {
  start: number;
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const range = end - start;
    const step = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(start + range * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, start, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.0, 0.0, 0.2, 1.0] },
  },
};

export function StorytellingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(170deg, oklch(0.14 0.018 248) 0%, oklch(0.10 0.008 248) 100%)",
      }}
      data-ocid="storytelling.section"
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 20%, oklch(0.665 0.196 41 / 0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex flex-col gap-14"
        >
          {/* ── Urgency bar ── */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] font-bold"
            style={{ color: "oklch(0.665 0.196 41)" }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ background: "oklch(0.665 0.196 41)" }}
            />
            <Clock className="w-3.5 h-3.5" />
            <span>The window to act is closing — we need you right now</span>
          </motion.div>

          {/* ── Main headline ── */}
          <motion.div variants={fadeUp} className="max-w-3xl">
            <h2
              className="font-display font-bold leading-[1.05] tracking-tight"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
                color: "#fff",
              }}
            >
              Every day you wait,{" "}
              <span style={{ color: "oklch(0.665 0.196 41)" }}>
                a child loses something they can never get back.
              </span>
            </h2>
            <p
              className="mt-5 text-lg leading-relaxed"
              style={{ color: "oklch(0.82 0.02 248)" }}
            >
              This is not abstract. This is not political theatre. This is a
              child's life — and the people who should protect it are choosing
              not to. The question is:{" "}
              <strong className="text-white">
                are you choosing to do nothing too?
              </strong>
            </p>
          </motion.div>

          {/* ── Aisha's story card ── */}
          <motion.div variants={fadeUp}>
            <div
              className="relative rounded-2xl p-7 md:p-10 border"
              style={{
                background: "oklch(0.18 0.022 248 / 0.85)",
                borderColor: "oklch(0.665 0.196 41 / 0.35)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Pull-quote marker */}
              <div
                className="absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center text-white font-display font-black text-xl shadow-lg"
                style={{ background: "oklch(0.665 0.196 41)" }}
              >
                &ldquo;
              </div>

              <p
                className="text-sm uppercase tracking-[0.15em] font-bold mb-5"
                style={{ color: "oklch(0.665 0.196 41)" }}
              >
                A real story. A real child. A preventable tragedy.
              </p>

              <div
                className="space-y-4 text-base md:text-lg leading-relaxed"
                style={{ color: "oklch(0.88 0.015 248)" }}
              >
                <p>
                  <strong className="text-white">
                    {STORY_TEXT.child} was {STORY_TEXT.age} years old
                  </strong>{" "}
                  when she stopped eating. Her mother noticed first — the sunken
                  eyes, the fever that wouldn't break for three days. They lived
                  in {STORY_TEXT.location}. The nearest government clinic had
                  been{" "}
                  <strong className="text-white">"temporarily closed"</strong>{" "}
                  for eleven months. Budget cuts. Nobody came to reopen it.
                </p>
                <p>
                  Her father, Raza, spent two weeks walking to offices, filling
                  forms, being told to come back tomorrow. One clerk demanded a
                  small "processing fee" he couldn't afford. Another sent him to
                  a department that had been dissolved two years earlier. Nobody
                  cared. Nobody was punished. It was just{" "}
                  <strong className="text-white">
                    another file in a pile.
                  </strong>
                </p>
                <p>
                  By the time they scraped together money for a private doctor,
                  {STORY_TEXT.child} had lost 4 kilograms. She was treated. She
                  survived.
                </p>
                <p
                  className="text-xl md:text-2xl font-display font-bold leading-snug"
                  style={{ color: "#fff" }}
                >
                  Aisha was one of the lucky ones.
                  <br />
                  <span style={{ color: "oklch(0.665 0.196 41)" }}>
                    Thousands aren't.
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Loss aversion row ── */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                icon: AlertTriangle,
                stat: "1 in 3",
                label:
                  "children in underserved areas cannot access a doctor when sick",
                color: "oklch(0.72 0.21 42)",
              },
              {
                icon: TrendingUp,
                stat: "₹12,000 Cr",
                label:
                  "in healthcare funds go unspent or misrouted every year due to corruption",
                color: "oklch(0.72 0.21 42)",
              },
              {
                icon: Heart,
                stat: "47%",
                label:
                  "of families delay medical care because they cannot navigate the system",
                color: "oklch(0.72 0.21 42)",
              },
            ].map(({ icon: Icon, stat, label, color }) => (
              <div
                key={stat}
                className="rounded-xl p-5 border"
                style={{
                  background: "oklch(0.18 0.022 248 / 0.6)",
                  borderColor: "oklch(0.4 0.04 248 / 0.5)",
                }}
              >
                <Icon className="w-5 h-5 mb-3" style={{ color }} />
                <p
                  className="font-display font-black text-3xl mb-1"
                  style={{ color: "#fff" }}
                >
                  {stat}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.70 0.02 248)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* ── Social proof / live counter ── */}
          <motion.div variants={fadeUp}>
            <div
              className="rounded-xl px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border"
              style={{
                background: "oklch(0.20 0.028 248 / 0.8)",
                borderColor: "oklch(0.4 0.04 248 / 0.4)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.665 0.196 41 / 0.15)" }}
                >
                  <Users
                    className="w-6 h-6"
                    style={{ color: "oklch(0.665 0.196 41)" }}
                  />
                </div>
                <div>
                  <p className="font-display font-black text-3xl text-white">
                    <CounterAnimation start={3180} end={3247} duration={2200} />
                    <span
                      className="text-xl ml-1"
                      style={{ color: "oklch(0.665 0.196 41)" }}
                    >
                      +
                    </span>
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.70 0.02 248)" }}
                  >
                    supporters have already chosen to stand up
                  </p>
                </div>
              </div>
              <p
                className="text-sm font-medium leading-relaxed max-w-xs"
                style={{ color: "oklch(0.82 0.02 248)" }}
              >
                They didn't wait. They didn't say{" "}
                <em>"someone else will do it."</em> They made a choice.{" "}
                <strong className="text-white">You still can too.</strong>
              </p>
            </div>
          </motion.div>

          {/* ── Identity appeal + CTA ── */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center text-center gap-6 pt-2"
          >
            <p
              className="max-w-2xl text-xl md:text-2xl font-display font-bold leading-snug"
              style={{ color: "oklch(0.88 0.015 248)" }}
            >
              You are not just donating money.{" "}
              <span className="text-white">
                You are choosing who you are as a person.
              </span>
            </p>
            <p
              className="max-w-xl text-base leading-relaxed"
              style={{ color: "oklch(0.68 0.025 248)" }}
            >
              People who look back on moments like this always say the same
              thing: <em>"I wish I had done more."</em> You have the chance to
              not have that regret. This is your moment.
            </p>

            <a
              href="#donate"
              data-ocid="storytelling.primary_button"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl font-display font-black text-white uppercase tracking-[0.1em] text-lg md:text-xl shadow-2xl transition-all duration-200 hover:scale-105 active:scale-100"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.60 0.22 38), oklch(0.72 0.24 55))",
                boxShadow:
                  "0 4px 32px oklch(0.60 0.22 38 / 0.45), 0 2px 8px oklch(0.60 0.22 38 / 0.3)",
              }}
            >
              <Heart className="w-5 h-5 fill-white/70 group-hover:fill-white transition-colors" />
              I refuse to do nothing — donate now
              <span
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.24 38 / 0.3), oklch(0.78 0.26 55 / 0.3))",
                }}
              />
            </a>

            <p className="text-xs" style={{ color: "oklch(0.52 0.025 248)" }}>
              Every rupee goes directly to the campaign. No middlemen.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
