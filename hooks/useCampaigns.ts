import { useCallback, useState } from "react";
import { AbiItem } from "web3-utils/types";
import CampaingFactory from "../ethereum/factory";
import getCampaignInstance from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Status, SummaryItem } from "../misc/types";

type MetamaskError = {
  code: number;
  message: string;
  stack: string;
};

function formatSummary(summary: { [key in number]: string }): SummaryItem[] {
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
    },
    {
      id: "manager",
      name: "Manager",
      value: summary[4],
      description: "Address of the campaign creator",
    },
  ];
}

const useCampaigns = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const [campaigns, setCampaigns] = useState<string[]>();

  const setErrorTimeout = useCallback((error: string) => {
    setError(error);
    setStatus("error");

    setTimeout(() => {
      setError(undefined);
      setStatus("idle");
    }, 5000);
  }, []);

  const loadCampaigns = useCallback(async () => {
    setStatus("loading");

    const campaigns = await CampaingFactory.methods
      .getContracts()
      .call()
      .catch(setErrorTimeout);
    if (campaigns) {
      setCampaigns([...campaigns, ...campaigns]);
      setStatus("success");
    }
  }, [setErrorTimeout]);

  const createCampaign = useCallback(
    async function (minContribution: number) {
      console.log(`createCampaign minContribution: ${minContribution}`);
      setStatus("loading");
      try {
        const [from] = await web3.eth.getAccounts();

        await CampaingFactory.methods
          .createContract(minContribution)
          .send({ from });

        setStatus("success");

        loadCampaigns();
      } catch (error: any) {
        if (typeof error === "string") setErrorTimeout(error);
        else if (typeof error?.message === "string")
          setErrorTimeout(error.message);
        else throw error;
      }
    },
    [loadCampaigns, setErrorTimeout]
  );

  const getSummary = useCallback(
    async function (address: string): Promise<SummaryItem[]> {
      const campaign = await getCampaignInstance(address);
      const summary = await campaign.methods
        .getSummary()
        .call()
        .catch(setErrorTimeout);

      return formatSummary(summary);
    },
    [setErrorTimeout]
  );

  return {
    status,
    error,
    campaigns,
    loadCampaigns,
    createCampaign,
    getSummary,
  };
};

export default useCampaigns;
