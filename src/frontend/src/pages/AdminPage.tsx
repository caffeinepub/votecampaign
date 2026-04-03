import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DollarSign,
  Loader2,
  LogIn,
  LogOut,
  Megaphone,
  MessageSquare,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllDonationRecords,
  useAllSupporters,
  useAllSurveyResponses,
  useIsCallerAdmin,
} from "../hooks/useQueries";

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

        {/* Not admin */}
        {isLoggedIn && !adminLoading && !isAdmin && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="admin.error_state"
          >
            <ShieldAlert className="w-14 h-14 text-destructive mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Not Authorized
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Your account does not have admin privileges for this campaign.
            </p>
          </div>
        )}

        {/* Admin dashboard */}
        {isLoggedIn && !adminLoading && isAdmin && (
          <div data-ocid="admin.panel">
            <div className="mb-8">
              <h1 className="font-display font-bold text-2xl text-foreground mb-1">
                Campaign Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage supporters, survey responses, and donations.
              </p>
            </div>

            <Tabs defaultValue="supporters" data-ocid="admin.tab">
              <TabsList className="mb-6">
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
              </TabsList>

              <TabsContent value="supporters" data-ocid="admin.table">
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

              <TabsContent value="responses" data-ocid="admin.table">
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

              <TabsContent value="donations" data-ocid="admin.table">
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
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
