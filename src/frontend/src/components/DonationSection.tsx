import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  QrCode,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitDonationRecord } from "../hooks/useQueries";
import { StepMarker } from "./StepMarker";

const BANK_DETAILS = [
  { label: "Account Name", value: "DIGI NAZ", sensitive: false },
  {
    label: "Account Number",
    value: "015161900002873",
    masked: "XXXX XXXX 02873",
    sensitive: true,
  },
  {
    label: "IFSC Code",
    value: "YESB0000151",
    masked: "YESB XXXX",
    sensitive: true,
  },
  { label: "Bank", value: "YES Bank", sensitive: false },
];

const BANK_DETAILS_MAILTO =
  "mailto:diginz@outlook.com?subject=Bank%20Details%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20the%20bank%20details%20for%20making%20a%20donation%20to%20the%20VOICE%202026%20campaign.%0A%0AThank%20you.";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 p-1 rounded hover:bg-white/20 transition-colors text-white/60 hover:text-white"
      title="Copy to clipboard"
    >
      {copied ? (
        <CheckCircle2 className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

function DonationRecordForm() {
  const [donorName, setDonorName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [txError, setTxError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitDonation = useSubmitDonationRecord();

  const validate = () => {
    let valid = true;
    if (!donorName.trim()) {
      setNameError("Please enter your name.");
      valid = false;
    } else {
      setNameError("");
    }
    if (!transactionId.trim()) {
      setTxError("Please enter the Transaction ID / UTR Number.");
      valid = false;
    } else {
      setTxError("");
    }
    if (!amount.trim()) {
      setAmountError("Please enter the amount paid.");
      valid = false;
    } else {
      setAmountError("");
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await submitDonation.mutateAsync({
      donorName: donorName.trim(),
      transactionId: transactionId.trim(),
      amount: amount.trim(),
    });

    if (result.__kind__ === "ok") {
      setSubmitted(true);
      toast.success("Donation recorded! Thank you for your support.");
    } else {
      toast.error(
        result.value || "Failed to record donation. Please try again.",
      );
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-10 text-center"
        data-ocid="donation.success_state"
      >
        <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
        <h3 className="font-display font-bold text-xl text-foreground mb-1">
          Donation Recorded!
        </h3>
        <p className="text-muted-foreground text-sm">
          Thank you, <strong>{donorName}</strong>! Your contribution has been
          noted.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <Label
          htmlFor="donor-name"
          className="text-sm font-semibold mb-1.5 block"
        >
          Your Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="donor-name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Rahul Sharma"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className={`h-11 ${nameError ? "border-destructive" : ""}`}
          data-ocid="donation.input"
        />
        {nameError && (
          <p
            className="text-destructive text-xs mt-1.5 flex items-center gap-1"
            data-ocid="donation.name_error"
          >
            <AlertCircle className="w-3 h-3" />
            {nameError}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="transaction-id"
          className="text-sm font-semibold mb-1.5 block"
        >
          Transaction ID / UTR Number{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="transaction-id"
          type="text"
          placeholder="e.g. UTR123456789012"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className={`h-11 font-mono ${txError ? "border-destructive" : ""}`}
          data-ocid="donation.input"
        />
        {txError && (
          <p
            className="text-destructive text-xs mt-1.5 flex items-center gap-1"
            data-ocid="donation.tx_error"
          >
            <AlertCircle className="w-3 h-3" />
            {txError}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="amount-paid"
          className="text-sm font-semibold mb-1.5 block"
        >
          Amount Paid <span className="text-destructive">*</span>
        </Label>
        <Input
          id="amount-paid"
          type="text"
          placeholder="e.g. ₹500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`h-11 ${amountError ? "border-destructive" : ""}`}
          data-ocid="donation.input"
        />
        {amountError && (
          <p
            className="text-destructive text-xs mt-1.5 flex items-center gap-1"
            data-ocid="donation.amount_error"
          >
            <AlertCircle className="w-3 h-3" />
            {amountError}
          </p>
        )}
      </div>

      {submitDonation.isError && (
        <div
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-3"
          data-ocid="donation.error_state"
        >
          <p className="text-destructive text-sm">
            {submitDonation.error instanceof Error
              ? submitDonation.error.message
              : "An error occurred. Please try again."}
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={submitDonation.isPending}
        className="w-full h-12 bg-orange hover:bg-orange-dark text-white font-bold uppercase tracking-widest text-sm shadow-md"
        data-ocid="donation.submit_button"
      >
        {submitDonation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Recording...
          </>
        ) : (
          "✅ Record My Donation"
        )}
      </Button>
    </form>
  );
}

export function DonationSection() {
  const [bankVisible, setBankVisible] = useState(false);
  const [detailsRevealed, setDetailsRevealed] = useState(false);

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

        {/* Bank card + QR card row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
          {/* Bank Transfer Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="shadow-card border-orange/30 overflow-hidden h-full">
              <div className="bg-gradient-to-r from-orange to-orange-dark px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">
                    Bank Transfer
                  </h3>
                  <p className="text-white/70 text-xs">Direct bank deposit</p>
                </div>
                <Badge className="ml-auto bg-white/20 text-white border-0 text-xs">
                  Secure
                </Badge>
                <button
                  type="button"
                  onClick={() => setBankVisible((v) => !v)}
                  className="ml-2 flex items-center gap-1 text-white/70 hover:text-white text-xs font-semibold transition-colors bg-white/10 hover:bg-white/20 rounded-full px-3 py-1"
                  aria-label={
                    bankVisible
                      ? "Hide account details"
                      : "Show account details"
                  }
                  data-ocid="donation.toggle_button"
                >
                  {bankVisible ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" /> Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" /> Show
                    </>
                  )}
                </button>
              </div>
              <AnimatePresence initial={false}>
                {bankVisible && (
                  <motion.div
                    key="bank-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <CardContent className="pt-5 pb-5 bg-charcoal">
                      <div className="space-y-3">
                        {BANK_DETAILS.map(
                          ({ label, value, masked, sensitive }) => {
                            const displayValue =
                              sensitive && !detailsRevealed
                                ? (masked ?? value)
                                : value;
                            return (
                              <div
                                key={label}
                                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                              >
                                <span className="text-white/50 text-xs uppercase tracking-widest font-semibold">
                                  {label}
                                </span>
                                <div className="flex items-center">
                                  <span className="text-white font-mono text-sm font-semibold tracking-wider">
                                    {displayValue}
                                  </span>
                                  {sensitive && detailsRevealed && (
                                    <CopyButton text={value} />
                                  )}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                      {/* Reveal / Hide sensitive fields button */}
                      <button
                        type="button"
                        onClick={() => setDetailsRevealed((v) => !v)}
                        className="mt-4 w-full flex items-center justify-center gap-2 text-white/60 hover:text-white text-xs font-semibold transition-colors bg-white/5 hover:bg-white/10 rounded-lg py-2 border border-white/10"
                        data-ocid="donation.reveal_button"
                      >
                        {detailsRevealed ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Hide Account
                            Details
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Reveal Account
                            Details
                          </>
                        )}
                      </button>
                      <p className="text-white/40 text-xs mt-3 text-center">
                        Please use your name as the payment reference.
                      </p>
                      {/* Request bank details by email */}
                      <a
                        href={BANK_DETAILS_MAILTO}
                        className="mt-3 w-full flex items-center justify-center gap-2 text-white/60 hover:text-white text-xs font-semibold transition-colors bg-white/5 hover:bg-white/10 rounded-lg py-2 border border-white/10"
                        data-ocid="donation.email_button"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Request Bank Details by Email
                      </a>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="shadow-card border-orange/30 overflow-hidden h-full">
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
                <Badge className="ml-auto bg-white/20 text-white border-0 text-xs">
                  UPI
                </Badge>
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

        {/* Donation Record Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="shadow-card border-border/60 overflow-hidden">
            <div className="bg-gradient-to-r from-charcoal to-charcoal/90 px-6 py-4 flex items-center gap-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-orange" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">
                  Record Your Donation
                </h3>
                <p className="text-white/60 text-xs">
                  Already paid? Save your transaction details here
                </p>
              </div>
              <Badge className="ml-auto bg-orange/20 text-orange border-orange/30 text-xs">
                Optional
              </Badge>
            </div>
            <CardContent className="pt-6 pb-6">
              <DonationRecordForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
