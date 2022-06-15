export type Status = "error" | "loading" | "success" | "idle";

export type SummaryField =
  | "manager"
  | "balance"
  | "approversAmount"
  | "minimumContribution"
  | "pendingRequestsAmount";

type FormatedItem = {
  name: string;
  value: any;
  description: string;
};

export type SummaryItem = FormatedItem & {
  id: SummaryField;
  link?: {
    name: string;
    href: string;
  };
};

export enum RequestFields {
  id = "id",
  amount = "amount",
  destination = "destination",
  status = "status",
  amountApproved = "amountApproved",
}

export type RequestField =
  | RequestFields.id
  | RequestFields.amount
  | RequestFields.destination
  | RequestFields.status
  | RequestFields.amountApproved;

export type RequestItem = FormatedItem & {
  id: `${RequestField}${string}`;
  link?: {
    name: string;
    href: string;
  };
};

export type RequestRow = {
  [RequestFields.id]: string;
  [RequestFields.amount]: string;
  [RequestFields.destination]: string;
  [RequestFields.status]: CampaignStatusType;
  [RequestFields.amountApproved]: `${number}/${number}`;
};

export type Address = `0x${string}`;

export type MetamaskError = {
  code: number;
  message: string;
  stack: string;
};

export type CampaignDetailsRouteQuery = {
  address: Address;
};

export type ContractTupleResponse = { [key in number]: string };

export type ContractRequestItem = { [key in RequestField]: string };

export enum CampaignStatus {
  pending = "pending",
  finalized = "finalized",
}

export type CampaignStatusType =
  | CampaignStatus.pending
  | CampaignStatus.finalized;
