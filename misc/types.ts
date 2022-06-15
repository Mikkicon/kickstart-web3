export type Status = "error" | "loading" | "success" | "idle";

export type SummaryField =
  | "manager"
  | "balance"
  | "approversAmount"
  | "minimumContribution"
  | "pendingRequestsAmount";

export type SummaryItem = {
  id: SummaryField;
  name: string;
  value: any;
  description: string;
};
