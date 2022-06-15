import web3 from "../ethereum/web3";
import { SummaryItem, RequestItem } from "./types";

export async function asyncConfirm(duration = 1000) {
  return new Promise<void>(function (resolve, reject) {
    setTimeout(function () {
      const shouldResolve = confirm("Resolve?");
      if (shouldResolve) resolve();
      else reject({ message: "Mock error" });
    }, duration);
  });
}

export function formatSummary(summary: {
  [key in number]: string;
}): SummaryItem[] {
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

export function formatRequests(requests: {
  [key in number]: string;
}): RequestItem[] {
  return [];
}
