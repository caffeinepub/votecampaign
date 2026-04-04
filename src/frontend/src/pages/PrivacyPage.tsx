import {
  AlertCircle,
  Calendar,
  Eye,
  Lock,
  Mail,
  Server,
  Shield,
  UserCheck,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { CampaignFooter } from "../components/CampaignFooter";
import { CampaignHeader } from "../components/CampaignHeader";

const LAST_UPDATED = "April 3, 2026";
const CONTACT_EMAIL = "diginz@outlook.com";

const sections = [
  {
    id: "collect",
    icon: Eye,
    title: "What We Collect",
    color: "oklch(0.465 0.168 246)",
    items: [
      {
        label: "Pledge data",
        detail:
          "Your name and the pledge response you submit when you support the campaign.",
      },
      {
        label: "Survey responses",
        detail:
          "Your answers to campaign surveys, linked to your supporter record.",
      },
      {
        label: "Donation records",
        detail:
          "Your name, transaction ID or UTR number, and the donation amount you voluntarily enter.",
      },
      {
        label: "No passwords, no emails (unless you write to us)",
        detail:
          "We do not ask for or store passwords, email addresses, or phone numbers unless you contact us directly.",
      },
    ],
  },
  {
    id: "storage",
    icon: Server,
    title: "How It Is Stored",
    color: "oklch(0.6 0.14 160)",
    items: [
      {
        label: "Internet Computer Protocol (ICP) blockchain",
        detail:
          "All data is stored in a smart-contract canister on the ICP blockchain — a decentralized, tamper-resistant system with no central server.",
      },
      {
        label: "No SQL databases, no cloud buckets",
        detail:
          "We do not use AWS, Google Cloud, Azure, or any traditional database. Data lives on-chain.",
      },
      {
        label: "Publicly readable on-chain",
        detail:
          "Because this runs on a public blockchain, on-chain state is technically readable by anyone with the right tools. Do not submit sensitive personal information beyond what is required.",
      },
    ],
  },
  {
    id: "access",
    icon: Lock,
    title: "Who Can Access Your Data",
    color: "oklch(0.665 0.196 41)",
    items: [
      {
        label: "Campaign admins only",
        detail:
          "Only verified administrators authenticated via Internet Identity can view donation records and full supporter data through the admin dashboard.",
      },
      {
        label: "No third-party data sharing",
        detail:
          "We do not sell, rent, license, or share your data with advertisers, data brokers, political parties, or any external organization.",
      },
      {
        label: "No advertising or tracking",
        detail:
          "There are no advertising pixels, Facebook trackers, Google Analytics, or any third-party analytics loaded on this site.",
      },
    ],
  },
  {
    id: "rights",
    icon: UserCheck,
    title: "Your Rights",
    color: "oklch(0.55 0.15 300)",
    items: [
      {
        label: "Right to know",
        detail:
          "You may contact us to ask what data associated with your name exists in our system.",
      },
      {
        label: "Right to removal",
        detail:
          "You may request deletion of your data by emailing us. We will process removal requests within 14 days.",
      },
      {
        label: "Blockchain limitation",
        detail:
          "Note: data already written to the ICP blockchain may be part of canister state history. We can remove records from the active dataset but historical chain state is immutable by design.",
      },
    ],
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.0, 0.0, 0.2, 1.0] },
  }),
};

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <CampaignHeader />

      <main>
        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.267 0.072 244.0), oklch(0.231 0.065 244.0))",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 30% 70%, oklch(0.465 0.168 246 / 0.5) 0%, transparent 55%)",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.0, 0.0, 0.2, 1.0] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.665 0.196 41 / 0.2)" }}
                >
                  <Shield
                    className="w-5 h-5"
                    style={{ color: "oklch(0.665 0.196 41)" }}
                  />
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: "oklch(0.665 0.196 41)" }}
                >
                  VOICE 2026 · Legal
                </span>
              </div>
              <h1
                className="font-display font-black text-white leading-tight mb-4"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                Data Privacy Policy
              </h1>
              <p
                className="text-lg max-w-xl leading-relaxed"
                style={{ color: "oklch(0.82 0.02 248)" }}
              >
                We believe in transparency. Here is exactly what data we
                collect, where it lives, and who can see it — in plain language,
                not legal jargon.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "oklch(0.70 0.03 248)" }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {LAST_UPDATED}</span>
                </div>
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "oklch(0.70 0.03 248)" }}
                >
                  <Mail className="w-4 h-4" />
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="hover:text-white transition-colors underline underline-offset-2"
                    data-ocid="privacy.link"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Policy sections ── */}
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i}
                  className="rounded-2xl border bg-card p-6 md:p-8 shadow-card"
                  data-ocid={`privacy.${section.id}.card`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: `color-mix(in oklch, ${section.color} 15%, transparent)`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: section.color }}
                      />
                    </div>
                    <h2 className="font-display font-bold text-xl md:text-2xl text-foreground">
                      {section.title}
                    </h2>
                  </div>

                  <ul className="space-y-4">
                    {section.items.map((item) => (
                      <li key={item.label} className="flex gap-3">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                          style={{ background: section.color }}
                        />
                        <div>
                          <p className="font-semibold text-foreground text-sm mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {item.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* ── Blockchain notice ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.0, 0.0, 0.2, 1.0],
            }}
            className="mt-8 rounded-2xl p-6 md:p-8 border flex gap-4"
            style={{
              background: "oklch(0.96 0.015 50)",
              borderColor: "oklch(0.80 0.12 50)",
            }}
            data-ocid="privacy.notice.card"
          >
            <AlertCircle
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: "oklch(0.60 0.18 50)" }}
            />
            <div>
              <p
                className="font-bold text-sm mb-1"
                style={{ color: "oklch(0.40 0.12 50)" }}
              >
                A note on blockchain transparency
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.50 0.08 50)" }}
              >
                This app runs on the Internet Computer Protocol — a public
                blockchain. While only campaign admins have dashboard access,
                on-chain canister state is technically inspectable by anyone
                with blockchain tools. Please do not enter sensitive personal
                information (like national ID numbers or home addresses) into
                any form on this site.
              </p>
            </div>
          </motion.div>

          {/* ── Contact ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.0, 0.0, 0.2, 1.0],
            }}
            className="mt-6 rounded-2xl p-6 md:p-8 border bg-card shadow-card text-center"
            data-ocid="privacy.contact.card"
          >
            <Shield
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "oklch(0.465 0.168 246)" }}
            />
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              Questions or Concerns?
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              We take privacy seriously. If you have any questions, want to
              request data removal, or need clarification on how your data is
              used, reach out directly.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20Inquiry%20%E2%80%93%20VOICE%202026`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: "oklch(0.465 0.168 246)" }}
              data-ocid="privacy.contact.primary_button"
            >
              <Mail className="w-4 h-4" />
              Contact Us About Privacy
            </a>
            <p className="mt-4 text-xs text-muted-foreground">
              We respond within 3–5 business days.
            </p>
          </motion.div>
        </div>
      </main>

      <CampaignFooter />
    </div>
  );
}
