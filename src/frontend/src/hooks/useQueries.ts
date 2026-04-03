import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DonationRecord,
  backendInterface as FullBackend,
  PublicStats,
  Supporter,
  SurveyResponse,
} from "../backend.d";
import { useActor } from "./useActor";

/**
 * Cast the actor to the full typed backend interface from backend.d.ts.
 * The generated backend.ts exports an empty backendInterface placeholder;
 * the real contract lives in the .d.ts design-time declaration.
 */
function getBackend(actor: unknown): FullBackend | null {
  if (!actor) return null;
  return actor as FullBackend;
}

export function usePublicStats() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<PublicStats>({
    queryKey: ["publicStats"],
    queryFn: async () => {
      const actor = getBackend(rawActor);
      if (!actor) {
        return {
          totalSupporters: BigInt(0),
          totalVolunteers: BigInt(0),
          totalDonors: BigInt(0),
          economyCount: BigInt(0),
          climateCount: BigInt(0),
          healthCount: BigInt(0),
          educationCount: BigInt(0),
        };
      }
      return actor.getPublicStats();
    },
    enabled: !isFetching,
    refetchInterval: 30000,
  });
}

export function usePledgeSupport() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      const actor = getBackend(rawActor);
      if (!actor) throw new Error("Backend not available");
      return actor.pledgeSupport(name, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicStats"] });
    },
  });
}

export function useSubmitSurvey() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      supporterId,
      topIssue,
      wouldVolunteer,
      wouldDonate,
      shareReason,
    }: {
      supporterId: bigint;
      topIssue: string;
      wouldVolunteer: boolean;
      wouldDonate: boolean;
      shareReason: string;
    }) => {
      const actor = getBackend(rawActor);
      if (!actor) throw new Error("Backend not available");
      return actor.submitSurvey(
        supporterId,
        topIssue,
        wouldVolunteer,
        wouldDonate,
        shareReason,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicStats"] });
    },
  });
}

export function useAllSupporters() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<Supporter[]>({
    queryKey: ["allSupporters"],
    queryFn: async () => {
      const actor = getBackend(rawActor);
      if (!actor) return [];
      return actor.getAllSupporters();
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useAllSurveyResponses() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<SurveyResponse[]>({
    queryKey: ["allSurveyResponses"],
    queryFn: async () => {
      const actor = getBackend(rawActor);
      if (!actor) return [];
      return actor.getAllSurveyResponses();
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useAllDonationRecords() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<DonationRecord[]>({
    queryKey: ["allDonationRecords"],
    queryFn: async () => {
      const actor = getBackend(rawActor);
      if (!actor) return [];
      return actor.getAllDonationRecords();
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useSubmitDonationRecord() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      donorName,
      transactionId,
      amount,
    }: {
      donorName: string;
      transactionId: string;
      amount: string;
    }) => {
      const actor = getBackend(rawActor);
      if (!actor) throw new Error("Backend not available");
      return actor.submitDonationRecord(donorName, transactionId, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicStats"] });
      queryClient.invalidateQueries({ queryKey: ["allDonationRecords"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      const actor = getBackend(rawActor);
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!rawActor && !isFetching,
  });
}
