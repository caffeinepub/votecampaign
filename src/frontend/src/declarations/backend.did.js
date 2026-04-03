/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Supporter = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    email: IDL.Text,
    timestamp: IDL.Int,
  });

  const SurveyResponse = IDL.Record({
    supporterId: IDL.Nat,
    topIssue: IDL.Text,
    wouldVolunteer: IDL.Bool,
    wouldDonate: IDL.Bool,
    shareReason: IDL.Text,
  });

  const DonationRecord = IDL.Record({
    id: IDL.Nat,
    donorName: IDL.Text,
    transactionId: IDL.Text,
    amount: IDL.Text,
    timestamp: IDL.Int,
  });

  const PublicStats = IDL.Record({
    totalSupporters: IDL.Nat,
    totalVolunteers: IDL.Nat,
    totalDonors: IDL.Nat,
    economyCount: IDL.Nat,
    climateCount: IDL.Nat,
    healthCount: IDL.Nat,
    educationCount: IDL.Nat,
  });

  const PledgeResult = IDL.Variant({
    ok: IDL.Nat,
    err: IDL.Text,
  });

  const SurveyResult = IDL.Variant({
    ok: IDL.Null,
    err: IDL.Text,
  });

  const DonationResult = IDL.Variant({
    ok: IDL.Nat,
    err: IDL.Text,
  });

  const UserRole = IDL.Variant({
    admin: IDL.Null,
    user: IDL.Null,
    guest: IDL.Null,
  });

  return IDL.Service({
    _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
    getCallerUserRole: IDL.Func([], [UserRole], []),
    assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
    isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
    pledgeSupport: IDL.Func([IDL.Text, IDL.Text], [PledgeResult], []),
    submitSurvey: IDL.Func(
      [IDL.Nat, IDL.Text, IDL.Bool, IDL.Bool, IDL.Text],
      [SurveyResult],
      []
    ),
    getPublicStats: IDL.Func([], [PublicStats], ['query']),
    getAllSupporters: IDL.Func([], [IDL.Vec(Supporter)], ['query']),
    getAllSurveyResponses: IDL.Func([], [IDL.Vec(SurveyResponse)], ['query']),
    submitDonationRecord: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text],
      [DonationResult],
      []
    ),
    getAllDonationRecords: IDL.Func([], [IDL.Vec(DonationRecord)], ['query']),
  });
};

export const idlService = idlFactory({ IDL });

export const init = ({ IDL }) => { return []; };
