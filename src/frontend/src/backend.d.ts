import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;

export type UserRole =
  | { __kind__: "admin" }
  | { __kind__: "user" }
  | { __kind__: "guest" };

export interface Supporter {
  id: bigint;
  name: string;
  email: string;
  timestamp: bigint;
}

export interface SurveyResponse {
  supporterId: bigint;
  topIssue: string;
  wouldVolunteer: boolean;
  wouldDonate: boolean;
  shareReason: string;
}

export interface DonationRecord {
  id: bigint;
  donorName: string;
  transactionId: string;
  amount: string;
  timestamp: bigint;
}

export interface PublicStats {
  totalSupporters: bigint;
  totalVolunteers: bigint;
  totalDonors: bigint;
  economyCount: bigint;
  climateCount: bigint;
  healthCount: bigint;
  educationCount: bigint;
}

export type PledgeResult =
  | { __kind__: "ok"; value: bigint }
  | { __kind__: "err"; value: string };

export type SurveyResultType =
  | { __kind__: "ok" }
  | { __kind__: "err"; value: string };

export type DonationResult =
  | { __kind__: "ok"; value: bigint }
  | { __kind__: "err"; value: string };

export interface backendInterface {
  // Authorization
  _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  getCallerUserRole(): Promise<UserRole>;
  assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
  isCallerAdmin(): Promise<boolean>;

  // Campaign
  pledgeSupport(name: string, email: string): Promise<PledgeResult>;
  submitSurvey(
    supporterId: bigint,
    topIssue: string,
    wouldVolunteer: boolean,
    wouldDonate: boolean,
    shareReason: string
  ): Promise<SurveyResultType>;
  getPublicStats(): Promise<PublicStats>;
  getAllSupporters(): Promise<Supporter[]>;
  getAllSurveyResponses(): Promise<SurveyResponse[]>;

  // Donations
  submitDonationRecord(
    donorName: string,
    transactionId: string,
    amount: string
  ): Promise<DonationResult>;
  getAllDonationRecords(): Promise<DonationRecord[]>;
}
