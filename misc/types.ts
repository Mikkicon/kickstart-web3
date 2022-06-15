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
  link?: {
    name: string;
    href: string;
  };
};

export type RequestItem = {};

export type Address = `0x${string}`;

export type MetamaskError = {
  code: number;
  message: string;
  stack: string;
};

export type CampaignDetailsRouteQuery = {
  address: Address;
};
