import AccessControl "./authorization/access-control";
import MixinAuthorization "./authorization/MixinAuthorization";
import Queue "mo:core/Queue";
import Time "mo:core/Time";

actor {
  // ─── Authorization ──────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ─── Types ─────────────────────────────────────────────────────────
  public type Supporter = {
    id : Nat;
    name : Text;
    email : Text;
    timestamp : Int;
  };

  public type SurveyResponse = {
    supporterId : Nat;
    topIssue : Text;
    wouldVolunteer : Bool;
    wouldDonate : Bool;
    shareReason : Text;
  };

  public type DonationRecord = {
    id : Nat;
    donorName : Text;
    transactionId : Text;
    amount : Text;
    timestamp : Int;
  };

  public type PublicStats = {
    totalSupporters : Nat;
    totalVolunteers : Nat;
    totalDonors : Nat;
    economyCount : Nat;
    climateCount : Nat;
    healthCount : Nat;
    educationCount : Nat;
  };

  public type PledgeResult = { #ok : Nat; #err : Text };
  public type SurveyResult = { #ok; #err : Text };
  public type DonationResult = { #ok : Nat; #err : Text };

  // ─── State ─────────────────────────────────────────────────────────
  let supporters = Queue.empty<Supporter>();
  let surveyResponses = Queue.empty<SurveyResponse>();
  let donationRecords = Queue.empty<DonationRecord>();
  var nextId : Nat = 1;
  var nextDonationId : Nat = 1;

  // ─── Public: Pledge ────────────────────────────────────────────────
  public func pledgeSupport(name : Text, email : Text) : async PledgeResult {
    if (name.size() == 0) return #err "Name is required";
    if (email.size() == 0) return #err "Email is required";
    let id = nextId;
    nextId += 1;
    let s : Supporter = { id; name; email; timestamp = Time.now() };
    supporters.pushBack(s);
    #ok id
  };

  // ─── Public: Survey ─────────────────────────────────────────────────
  public func submitSurvey(
    supporterId : Nat,
    topIssue : Text,
    wouldVolunteer : Bool,
    wouldDonate : Bool,
    shareReason : Text
  ) : async SurveyResult {
    let validIssues = ["Corruption", "Health", "Education", "Youth"];
    var isValid = false;
    for (i in validIssues.vals()) {
      if (i == topIssue) isValid := true;
    };
    if (not isValid) return #err "Invalid issue";
    let r : SurveyResponse = { supporterId; topIssue; wouldVolunteer; wouldDonate; shareReason };
    surveyResponses.pushBack(r);
    #ok
  };

  // ─── Public: Submit Donation Record ────────────────────────────────
  public func submitDonationRecord(
    donorName : Text,
    transactionId : Text,
    amount : Text
  ) : async DonationResult {
    if (donorName.size() == 0) return #err "Donor name is required";
    if (transactionId.size() == 0) return #err "Transaction ID is required";
    let id = nextDonationId;
    nextDonationId += 1;
    let d : DonationRecord = { id; donorName; transactionId; amount; timestamp = Time.now() };
    donationRecords.pushBack(d);
    #ok id
  };

  // ─── Public: Stats ──────────────────────────────────────────────────
  public query func getPublicStats() : async PublicStats {
    var volunteers = 0;
    var donors = 0;
    var corruption = 0;
    var youth = 0;
    var health = 0;
    var education = 0;
    for (r in surveyResponses.toArray().vals()) {
      if (r.wouldVolunteer) volunteers += 1;
      if (r.wouldDonate) donors += 1;
      if (r.topIssue == "Corruption") corruption += 1;
      if (r.topIssue == "Youth") youth += 1;
      if (r.topIssue == "Health") health += 1;
      if (r.topIssue == "Education") education += 1;
    };
    {
      totalSupporters = supporters.size();
      totalVolunteers = volunteers;
      totalDonors = donors;
      economyCount = corruption;
      climateCount = youth;
      healthCount = health;
      educationCount = education;
    }
  };

  // ─── Admin: All Supporters ──────────────────────────────────────────
  public query ({ caller }) func getAllSupporters() : async [Supporter] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    supporters.toArray()
  };

  // ─── Admin: All Surveys ─────────────────────────────────────────────
  public query ({ caller }) func getAllSurveyResponses() : async [SurveyResponse] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    surveyResponses.toArray()
  };

  // ─── Admin: All Donation Records ────────────────────────────────────
  public query ({ caller }) func getAllDonationRecords() : async [DonationRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    donationRecords.toArray()
  };
}
