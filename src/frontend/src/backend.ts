/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";

export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

function some<T>(value: T): Some<T> {
    return { __kind__: "Some", value };
}
function none(): None {
    return { __kind__: "None" };
}
function isNone<T>(option: Option<T>): option is None {
    return option.__kind__ === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option.__kind__ === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) throw new Error("unwrap: none");
    return option.value;
}

export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null) {
        if (blob) this._blob = blob;
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob {
        return new ExternalBlob(url, null);
    }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) return this._blob;
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string { return this.directURL; }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}

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
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
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
    submitDonationRecord(
        donorName: string,
        transactionId: string,
        amount: string
    ): Promise<DonationResult>;
    getAllDonationRecords(): Promise<DonationRecord[]>;
}

function toVariantKind<T extends Record<string, unknown>>(candid: T): { __kind__: string; value?: unknown } {
    const key = Object.keys(candid)[0];
    const val = candid[key];
    if (val === null || val === undefined) return { __kind__: key };
    return { __kind__: key, value: val };
}

export class Backend implements backendInterface {
    constructor(
        private actor: ActorSubclass<_SERVICE>,
        private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
        private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
        private processError?: (error: unknown) => never
    ) {}

    async _initializeAccessControlWithSecret(userSecret: string): Promise<void> {
        try { await this.actor._initializeAccessControlWithSecret(userSecret); }
        catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async getCallerUserRole(): Promise<UserRole> {
        try {
            const result = await this.actor.getCallerUserRole();
            return toVariantKind(result) as UserRole;
        } catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async assignCallerUserRole(user: Principal, role: UserRole): Promise<void> {
        try {
            const candidRole = { [role.__kind__]: null };
            await this.actor.assignCallerUserRole(user, candidRole as never);
        } catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async isCallerAdmin(): Promise<boolean> {
        try { return await this.actor.isCallerAdmin(); }
        catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async pledgeSupport(name: string, email: string): Promise<PledgeResult> {
        try {
            const result = await this.actor.pledgeSupport(name, email);
            return toVariantKind(result) as PledgeResult;
        } catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async submitSurvey(
        supporterId: bigint,
        topIssue: string,
        wouldVolunteer: boolean,
        wouldDonate: boolean,
        shareReason: string
    ): Promise<SurveyResultType> {
        try {
            const result = await this.actor.submitSurvey(supporterId, topIssue, wouldVolunteer, wouldDonate, shareReason);
            return toVariantKind(result) as SurveyResultType;
        } catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async getPublicStats(): Promise<PublicStats> {
        try { return await this.actor.getPublicStats(); }
        catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async getAllSupporters(): Promise<Supporter[]> {
        try { return await this.actor.getAllSupporters() as Supporter[]; }
        catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async getAllSurveyResponses(): Promise<SurveyResponse[]> {
        try { return await this.actor.getAllSurveyResponses() as SurveyResponse[]; }
        catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async submitDonationRecord(
        donorName: string,
        transactionId: string,
        amount: string
    ): Promise<DonationResult> {
        try {
            const result = await this.actor.submitDonationRecord(donorName, transactionId, amount);
            return toVariantKind(result) as DonationResult;
        } catch (e) { if (this.processError) this.processError(e); throw e; }
    }

    async getAllDonationRecords(): Promise<DonationRecord[]> {
        try { return await this.actor.getAllDonationRecords() as DonationRecord[]; }
        catch (e) { if (this.processError) this.processError(e); throw e; }
    }
}

export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}

export function createActor(
    canisterId: string,
    _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    options: CreateActorOptions = {}
): Backend {
    const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
    if (options.agent && options.agentOptions) {
        console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
    }
    const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId,
        ...options.actorOptions,
    });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
