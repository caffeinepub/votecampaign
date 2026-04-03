/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

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

export type PledgeResult = { ok: bigint } | { err: string };
export type SurveyResult = { ok: null } | { err: string };
export type DonationResult = { ok: bigint } | { err: string };
export type UserRole = { admin: null } | { user: null } | { guest: null };

export interface _SERVICE {
  _initializeAccessControlWithSecret: ActorMethod<[string], undefined>;
  getCallerUserRole: ActorMethod<[], UserRole>;
  assignCallerUserRole: ActorMethod<[Principal, UserRole], undefined>;
  isCallerAdmin: ActorMethod<[], boolean>;
  pledgeSupport: ActorMethod<[string, string], PledgeResult>;
  submitSurvey: ActorMethod<[bigint, string, boolean, boolean, string], SurveyResult>;
  getPublicStats: ActorMethod<[], PublicStats>;
  getAllSupporters: ActorMethod<[], Supporter[]>;
  getAllSurveyResponses: ActorMethod<[], SurveyResponse[]>;
  submitDonationRecord: ActorMethod<[string, string, string], DonationResult>;
  getAllDonationRecords: ActorMethod<[], DonationRecord[]>;
}

export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
