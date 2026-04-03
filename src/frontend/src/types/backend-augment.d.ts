/**
 * Augment both the backendInterface and the Backend class from backend.ts
 * to include methods injected at deploy time by the Caffeine bindgen tool.
 *
 * By augmenting both simultaneously, the `Backend implements backendInterface`
 * constraint in the generated file remains satisfied.
 */
declare module "../backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    pledgeSupport(
      name: string,
      email: string,
    ): Promise<import("../backend.d").PledgeResult>;
    submitSurvey(
      supporterId: bigint,
      topIssue: string,
      wouldVolunteer: boolean,
      wouldDonate: boolean,
      shareReason: string,
    ): Promise<import("../backend.d").SurveyResultType>;
    getPublicStats(): Promise<import("../backend.d").PublicStats>;
    getAllSupporters(): Promise<import("../backend.d").Supporter[]>;
    getAllSurveyResponses(): Promise<import("../backend.d").SurveyResponse[]>;
  }

  interface Backend {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    pledgeSupport(
      name: string,
      email: string,
    ): Promise<import("../backend.d").PledgeResult>;
    submitSurvey(
      supporterId: bigint,
      topIssue: string,
      wouldVolunteer: boolean,
      wouldDonate: boolean,
      shareReason: string,
    ): Promise<import("../backend.d").SurveyResultType>;
    getPublicStats(): Promise<import("../backend.d").PublicStats>;
    getAllSupporters(): Promise<import("../backend.d").Supporter[]>;
    getAllSurveyResponses(): Promise<import("../backend.d").SurveyResponse[]>;
  }
}

export {};
