import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import web3 from "../ethereum/web3";
import { ApproveButton, FinalizeButton } from "../components/CellButton/CellButton";
import {
  SummaryItem,
  ContractTupleResponse,
  ContractRequestItem,
  RequestRow,
  CampaignStatus,
  RequestFields,
} from "./types";

export async function asyncConfirm(duration = 1000) {
  return new Promise<void>(function (resolve, reject) {
    setTimeout(function () {
      const shouldResolve = confirm("Resolve?");
      if (shouldResolve) resolve();
      else reject({ message: "Mock error" });
    }, duration);
  });
}

export function formatSummary(summary: ContractTupleResponse): SummaryItem[] {
  return [
    {
      id: "approversAmount",
      name: "Approvers Amount",
      value: parseInt(summary[0]),
      description: "Amount of people who approve requests",
    },
    {
      id: "minimumContribution",
      name: "Minimum Contribution",
      value: parseFloat(summary[1]),
      description: "Minimal contribution to become approver",
    },
    {
      id: "balance",
      name: "Balance",
      value: `${web3.utils.fromWei(summary[2], "ether")} ETH`,
      description: "Campaign current balance",
    },
    {
      id: "pendingRequestsAmount",
      name: "Pending Requests Amount",
      value: parseInt(summary[3]),
      description: "Amount of pending requests",
      link: { name: "Requests", href: "/requests" },
    },
    {
      id: "manager",
      name: "Manager",
      value: summary[4],
      description: "Address of the campaign creator",
    },
  ];
}

export function getRequestStatus(statusNumberString: string) {
  return Object.values(CampaignStatus)[parseInt(statusNumberString)];
}

export function formatRequests(
  requests: ContractRequestItem[],
  totalApprovers: number
): RequestRow[] {
  return requests.map((request) => ({
    [RequestFields.id]: request[RequestFields.id],
    [RequestFields.amount]: `${web3.utils.fromWei(
      request[RequestFields.amount],
      "ether"
    )} ETH`,
    [RequestFields.destination]: request[RequestFields.destination],
    [RequestFields.status]: getRequestStatus(request[RequestFields.status]),
    [RequestFields.amountApproved]: `${parseInt(
      request[RequestFields.amountApproved]
    )}/${totalApprovers}`,
  }));
}

export const requestsColDef: GridColDef[] = [
  { field: RequestFields.id, headerName: "Id", width: 30 },
  {
    field: RequestFields.amount,
    headerName: "Requested amount",
    type: "number",
    width: 120,
  },
  { field: RequestFields.destination, headerName: "Destination", width: 370 },
  {
    field: RequestFields.status,
    headerName: "Request status",
    width: 140,
  },
  {
    field: RequestFields.amountApproved,
    headerName: "Approved",
    width: 60,
  },
  {
    field: "Approve",
    headerName: "Approve",
    width: 150,
    renderCell: (params: GridRenderCellParams<any, any, any>) => (<ApproveButton params={params} />)
  },
  {
    field: "Finalize",
    headerName: "Finalize",
    width: 150,
    renderCell: ( params: GridRenderCellParams<any, any, any>) => (<FinalizeButton params={params} />)
  },
];
