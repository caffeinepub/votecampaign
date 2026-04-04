import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  DollarSign,
  Download,
  Heart,
  Loader2,
  LogIn,
  LogOut,
  Megaphone,
  MessageSquare,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { DonationRecord, Supporter, SurveyResponse } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllDonationRecords,
  useAllSupporters,
  useAllSurveyResponses,
  useInitializeAdmin,
  useIsCallerAdmin,
} from "../hooks/useQueries";
import {
  exportMultiSheet,
  exportSheet,
  formatTimestamp,
} from "../utils/exportToExcel";

// ─── Insights Tab ────────────────────────────────────────────────────────────

const ISSUE_COLORS: Record<string, string> = {
  Corruption: "bg-red-500",
  Health: "bg-green-500",
  Education: "bg-blue-500",
  Youth: "bg-purple-500",
};

function InsightsTab({
  supporters,
  responses,
  donations,
}: {
  supporters: Supporter[] | undefined;
  responses: SurveyResponse[] | undefined;
  donations: DonationRecord[] | undefined;
}) {
  const s = supporters ?? [];
  const r = responses ?? [];
  const d = donations ?? [];

  const totalSupporters = s.length;
  const totalVolunteers = r.filter((res) => res.wouldVolunteer).length;
  const totalDonors = r.filter((res) => res.wouldDonate).length;
  const donationsRecorded = d.length;

  const totalResponses = r.length;
  const volunteerPct =
    totalResponses > 0
      ? Math.round((totalVolunteers / totalResponses) * 100)
      : 0;
  const donorPct =
    totalResponses > 0 ? Math.round((totalDonors / totalResponses) * 100) : 0;

  // Issue counts
  const issueCounts: Record<string, number> = {
    Corruption: 0,
    Health: 0,
    Education: 0,
    Youth: 0,
  };
  for (const res of r) {
    const key = res.topIssue;
    if (key in issueCounts) {
      issueCounts[key] = (issueCounts[key] ?? 0) + 1;
    } else {
      // map partial matches
      if (key.toLowerCase().includes("corrupt"))
        issueCounts.Corruption = (issueCounts.Corruption ?? 0) + 1;
      else if (key.toLowerCase().includes("health"))
        issueCounts.Health = (issueCounts.Health ?? 0) + 1;
      else if (key.toLowerCase().includes("educ"))
        issueCounts.Education = (issueCounts.Education ?? 0) + 1;
      else if (key.toLowerCase().includes("youth"))
        issueCounts.Youth = (issueCounts.Youth ?? 0) + 1;
    }
  }
  const maxIssueCount = Math.max(...Object.values(issueCounts), 1);

  // Recent activity
  const recentSupporters = [...s]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 3);
  const recentDonations = [...d]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 3);

  const summaryCards = [
    {
      label: "Total Supporters",
      value: totalSupporters,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Willing to Volunteer",
      value: totalVolunteers,
      icon: Heart,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Ready to Donate",
      value: totalDonors,
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Donations Recorded",
      value: donationsRecorded,
      icon: BarChart2,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  function handleExportAll() {
    const supporterRows = s.map((sup, i) => ({
      "#": i + 1,
      Name: sup.name,
      Email: sup.email,
      Date: formatTimestamp(sup.timestamp),
    }));

    const responseRows = r.map((res) => ({
      "Supporter ID": String(res.supporterId),
      "Top Issue": res.topIssue,
      "Volunteer?": res.wouldVolunteer ? "Yes" : "No",
      "Donate?": res.wouldDonate ? "Yes" : "No",
      "Share Reason": res.shareReason,
    }));

    const donationRows = d.map((don, i) => ({
      "#": i + 1,
      "Donor Name": don.donorName,
      "Transaction ID": don.transactionId,
      Amount: don.amount,
      Date: formatTimestamp(don.timestamp),
    }));

    exportMultiSheet("voice2026-campaign-data.xlsx", [
      { name: "Supporters", rows: supporterRows },
      { name: "Survey Responses", rows: responseRows },
      { name: "Donations", rows: donationRows },
    ]);
  }

  const hasAnyData = s.length > 0 || r.length > 0 || d.length > 0;

  return (
    <div className="space-y-8" data-ocid="insights.panel">
      {/* Export All button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Campaign Insights</h2>
          <p className="text-xs text-muted-foreground">
            Overview of all campaign data
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportAll}
          disabled={!hasAnyData}
          data-ocid="insights.primary_button"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export All
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="shadow-sm border-border/60">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}
                >
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Issues */}
      <Card className="shadow-sm border-border/60">
        <CardContent className="pt-5 pb-5">
          <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
            Top Issues Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(issueCounts).map(([issue, count]) => {
              const pct = Math.round((count / maxIssueCount) * 100);
              const colorClass = ISSUE_COLORS[issue] ?? "bg-gray-400";
              return (
                <div key={issue}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {issue}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {count} response{count !== 1 ? "s" : ""} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {r.length === 0 && (
            <p
              className="text-muted-foreground text-sm text-center py-4"
              data-ocid="insights.empty_state"
            >
              No survey responses yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Volunteer & Donation readiness */}
      <Card className="shadow-sm border-border/60">
        <CardContent className="pt-5 pb-5">
          <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            Supporter Readiness
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-foreground">
                  Ready to Volunteer
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {volunteerPct}%
                </span>
              </div>
              <Progress value={volunteerPct} className="h-2.5" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-foreground">Ready to Donate</span>
                <span className="text-sm font-semibold text-orange-600">
                  {donorPct}%
                </span>
              </div>
              <Progress value={donorPct} className="h-2.5" />
            </div>
          </div>
          {totalResponses === 0 && (
            <p className="text-muted-foreground text-xs text-center mt-3">
              Based on 0 survey responses.
            </p>
          )}
          {totalResponses > 0 && (
            <p className="text-muted-foreground text-xs text-center mt-3">
              Based on {totalResponses} survey response
              {totalResponses !== 1 ? "s" : ""}.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/60">
          <CardContent className="pt-5 pb-5">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              Recent Supporters
            </h3>
            {recentSupporters.length === 0 ? (
              <p
                className="text-muted-foreground text-sm"
                data-ocid="recent-supporters.empty_state"
              >
                No supporters yet.
              </p>
            ) : (
              <div className="space-y-2">
                {recentSupporters.map((sup, i) => (
                  <div
                    key={String(sup.id)}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    data-ocid={`recent-supporters.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 text-xs font-bold">
                          {sup.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {sup.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(
                        Number(sup.timestamp) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardContent className="pt-5 pb-5">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Recent Donations
            </h3>
            {recentDonations.length === 0 ? (
              <p
                className="text-muted-foreground text-sm"
                data-ocid="recent-donations.empty_state"
              >
                No donations recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {recentDonations.map((don, i) => (
                  <div
                    key={String(don.id)}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    data-ocid={`recent-donations.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 text-xs font-bold">
                          {don.donorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground block">
                          {don.donorName}
                        </span>
                        <Badge
                          className="bg-green-100 text-green-700 border-green-200 text-xs"
                          variant="outline"
                        >
                          {don.amount}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(
                        Number(don.timestamp) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Admin Token Form ─────────────────────────────────────────────────────────

function AdminTokenForm() {
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const initAdmin = useInitializeAdmin();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setTokenError("Please enter your admin token.");
      return;
    }
    setTokenError("");
    try {
      await initAdmin.mutateAsync(token.trim());
    } catch {
      setTokenError(
        "Invalid token or authorization failed. Please check and try again.",
      );
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      data-ocid="admin.error_state"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.45 0.16 24), oklch(0.38 0.14 24))",
        }}
      >
        <ShieldAlert className="w-8 h-8 text-white" />
      </div>
      <h2 className="font-display font-bold text-2xl text-foreground mb-2">
        Admin Setup Required
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        If you are the campaign admin, enter your admin token to claim admin
        access.
      </p>

      <form
        onSubmit={handleVerify}
        className="w-full max-w-sm space-y-4 text-left"
        data-ocid="admin.modal"
      >
        <div>
          <Label
            htmlFor="admin-token"
            className="text-sm font-semibold mb-1.5 block"
          >
            Admin Token
          </Label>
          <Input
            id="admin-token"
            type="password"
            placeholder="Enter your admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={`h-11 ${tokenError ? "border-destructive" : ""}`}
            data-ocid="admin.input"
            autoComplete="current-password"
          />
          {tokenError && (
            <p
              className="text-destructive text-xs mt-1.5"
              data-ocid="admin.error_state"
            >
              {tokenError}
            </p>
          )}
          {initAdmin.isError && !tokenError && (
            <p
              className="text-destructive text-xs mt-1.5"
              data-ocid="admin.error_state"
            >
              Authorization failed. Check your token and try again.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={initAdmin.isPending}
          className="w-full h-11 font-semibold"
          data-ocid="admin.submit_button"
        >
          {initAdmin.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Admin Access"
          )}
        </Button>
      </form>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export function AdminPage() {
  const {
    identity,
    login,
    clear,
    isLoggingIn,
    isLoginSuccess,
    isInitializing,
  } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: supporters, isLoading: supportersLoading } = useAllSupporters();
  const { data: responses, isLoading: responsesLoading } =
    useAllSurveyResponses();
  const { data: donations, isLoading: donationsLoading } =
    useAllDonationRecords();

  function handleExportSupporters() {
    const rows = (supporters ?? []).map((s, i) => ({
      "#": i + 1,
      Name: s.name,
      Email: s.email,
      Date: formatTimestamp(s.timestamp),
    }));
    exportSheet("supporters.xlsx", "Supporters", rows);
  }

  function handleExportResponses() {
    const rows = (responses ?? []).map((r) => ({
      "Supporter ID": String(r.supporterId),
      "Top Issue": r.topIssue,
      "Volunteer?": r.wouldVolunteer ? "Yes" : "No",
      "Donate?": r.wouldDonate ? "Yes" : "No",
      "Share Reason": r.shareReason,
    }));
    exportSheet("survey-responses.xlsx", "Survey Responses", rows);
  }

  function handleExportDonations() {
    const rows = (donations ?? []).map((d, i) => ({
      "#": i + 1,
      "Donor Name": d.donorName,
      "Transaction ID": d.transactionId,
      Amount: d.amount,
      Date: formatTimestamp(d.timestamp),
    }));
    exportSheet("donations.xlsx", "Donations", rows);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header
        className="w-full py-4 px-4 border-b border-white/10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.267 0.072 244.0), oklch(0.231 0.065 244.0))",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-display font-bold text-lg">
              VOICE <span className="text-orange">2026</span>
            </span>
            <Badge className="ml-2 bg-orange/20 text-orange border-orange/30 text-xs">
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-white/70 hover:text-white text-sm transition-colors"
              data-ocid="admin.link"
            >
              ← Back to Campaign
            </a>
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={clear}
                data-ocid="admin.secondary_button"
              >
                <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Not logged in */}
        {!isLoggedIn && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="admin.card"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.267 0.072 244.0), oklch(0.465 0.168 246.0))",
              }}
            >
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Admin Access
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Sign in with your Internet Identity to access the admin dashboard.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="bg-campaign-blue hover:bg-campaign-blue-2 text-white px-8 h-11 font-semibold"
              data-ocid="admin.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
            {isLoginSuccess && !isAdmin && (
              <p className="text-muted-foreground text-xs mt-3">
                Checking permissions...
              </p>
            )}
          </div>
        )}

        {/* Logged in but checking admin */}
        {isLoggedIn && adminLoading && (
          <div
            className="flex flex-col items-center justify-center py-24"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="w-8 h-8 text-campaign-blue animate-spin mb-3" />
            <p className="text-muted-foreground text-sm">
              Checking admin access...
            </p>
          </div>
        )}

        {/* Not admin — show token form instead of static error */}
        {isLoggedIn && !adminLoading && !isAdmin && <AdminTokenForm />}

        {/* Admin dashboard */}
        {isLoggedIn && !adminLoading && isAdmin && (
          <div data-ocid="admin.panel">
            <div className="mb-8">
              <h1 className="font-display font-bold text-2xl text-foreground mb-1">
                Campaign Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage supporters, survey responses, donations, and insights.
              </p>
            </div>

            <Tabs defaultValue="supporters" data-ocid="admin.tab">
              <TabsList className="mb-6 flex-wrap h-auto gap-1">
                <TabsTrigger
                  value="supporters"
                  className="gap-2"
                  data-ocid="admin.tab"
                >
                  <Users className="w-4 h-4" /> Supporters
                  {supporters && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {supporters.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="responses"
                  className="gap-2"
                  data-ocid="admin.tab"
                >
                  <MessageSquare className="w-4 h-4" /> Survey Responses
                  {responses && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {responses.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="donations"
                  className="gap-2"
                  data-ocid="admin.tab"
                >
                  <DollarSign className="w-4 h-4" /> Donations
                  {donations && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {donations.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="gap-2"
                  data-ocid="admin.tab"
                >
                  <BarChart2 className="w-4 h-4" /> Insights
                </TabsTrigger>
              </TabsList>

              {/* ── Supporters Tab ── */}
              <TabsContent value="supporters" data-ocid="admin.table">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">Supporters</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportSupporters}
                    disabled={!supporters || supporters.length === 0}
                    data-ocid="supporters.secondary_button"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Export Excel
                  </Button>
                </div>
                <div className="rounded-xl border border-border/60 overflow-hidden shadow-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">#</TableHead>
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supportersLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-8" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-48" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : supporters && supporters.length > 0 ? (
                        supporters.map((s, i) => (
                          <TableRow
                            key={String(s.id)}
                            data-ocid={`supporters.item.${i + 1}`}
                          >
                            <TableCell className="text-muted-foreground text-sm">
                              {i + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {s.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {s.email}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(
                                Number(s.timestamp) / 1_000_000,
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-12 text-muted-foreground"
                            data-ocid="supporters.empty_state"
                          >
                            No supporters yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* ── Survey Responses Tab ── */}
              <TabsContent value="responses" data-ocid="admin.table">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">
                    Survey Responses
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportResponses}
                    disabled={!responses || responses.length === 0}
                    data-ocid="responses.secondary_button"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Export Excel
                  </Button>
                </div>
                <div className="rounded-xl border border-border/60 overflow-hidden shadow-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">
                          Supporter ID
                        </TableHead>
                        <TableHead className="font-semibold">
                          Top Issue
                        </TableHead>
                        <TableHead className="font-semibold">
                          Volunteer?
                        </TableHead>
                        <TableHead className="font-semibold">Donate?</TableHead>
                        <TableHead className="font-semibold">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responsesLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
                          <TableRow key={i}>
                            {Array.from({ length: 5 }).map((_, j) => (
                              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cells
                              <TableCell key={j}>
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : responses && responses.length > 0 ? (
                        responses.map((r, i) => (
                          <TableRow
                            key={String(r.supporterId)}
                            data-ocid={`responses.item.${i + 1}`}
                          >
                            <TableCell className="text-muted-foreground text-sm">
                              {String(r.supporterId)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {r.topIssue}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  r.wouldVolunteer
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-red-100 text-red-700 border-red-200"
                                }
                                variant="outline"
                              >
                                {r.wouldVolunteer ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  r.wouldDonate
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-red-100 text-red-700 border-red-200"
                                }
                                variant="outline"
                              >
                                {r.wouldDonate ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                              {r.shareReason || "—"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-12 text-muted-foreground"
                            data-ocid="responses.empty_state"
                          >
                            No survey responses yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* ── Donations Tab ── */}
              <TabsContent value="donations" data-ocid="admin.table">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">Donations</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportDonations}
                    disabled={!donations || donations.length === 0}
                    data-ocid="donations.secondary_button"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Export Excel
                  </Button>
                </div>
                <div className="rounded-xl border border-border/60 overflow-hidden shadow-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">#</TableHead>
                        <TableHead className="font-semibold">
                          Donor Name
                        </TableHead>
                        <TableHead className="font-semibold">
                          Transaction ID
                        </TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donationsLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
                          <TableRow key={i}>
                            {Array.from({ length: 5 }).map((_, j) => (
                              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cells
                              <TableCell key={j}>
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : donations && donations.length > 0 ? (
                        donations.map((d, i) => (
                          <TableRow
                            key={String(d.id)}
                            data-ocid={`donations.item.${i + 1}`}
                          >
                            <TableCell className="text-muted-foreground text-sm">
                              {i + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {d.donorName}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {d.transactionId}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className="bg-green-100 text-green-700 border-green-200"
                                variant="outline"
                              >
                                {d.amount}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(
                                Number(d.timestamp) / 1_000_000,
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-12 text-muted-foreground"
                            data-ocid="donations.empty_state"
                          >
                            No donation records yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* ── Insights Tab ── */}
              <TabsContent value="insights" data-ocid="admin.panel">
                <InsightsTab
                  supporters={supporters}
                  responses={responses}
                  donations={donations}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
