import { useCallback, useState } from "react";
import { AbiItem } from "web3-utils/types";
import CampaingFactory from "../ethereum/factory";
import getCampaignInstance from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Address, RequestItem, Status, SummaryItem } from "../misc/types";
import { asyncConfirm, formatRequests, formatSummary } from "../misc/utils";

const useCampaigns = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const [campaigns, setCampaigns] = useState<string[]>();

  const setStatusTimeout = useCallback((status: Status) => {
    setStatus(status);
    setTimeout(() => setStatus("idle"), 5000);
  }, []);

  const setErrorTimeout = useCallback(
    (error: string) => {
      setError(error);
      setStatusTimeout("error");

      setTimeout(() => setError(undefined), 5000);
    },
    [setStatusTimeout]
  );

  const loadCampaigns = useCallback(async () => {
    setStatus("loading");

    const campaigns = await CampaingFactory.methods
      .getContracts()
      .call()
      .catch(setErrorTimeout);
    if (campaigns) {
      setCampaigns([...campaigns, ...campaigns]);
      setStatusTimeout("success");
    }
  }, [setErrorTimeout, setStatusTimeout]);

  const getSummary = useCallback(
    async function (address: Address): Promise<SummaryItem[]> {
      const campaign = await getCampaignInstance(address);
      const summary = await campaign.methods
        .getSummary()
        .call()
        .catch(setErrorTimeout);

      return formatSummary(summary);
    },
    [setErrorTimeout]
  );

  const getRequests = useCallback(
    async function (address: Address): Promise<RequestItem[]> {
      const campaign = await getCampaignInstance(address);
      const requests = await campaign.methods
        .requests()
        .call()
        .catch(setErrorTimeout);

      return formatRequests(requests);
    },
    [setErrorTimeout]
  );

  const createRequest = useCallback(
    async function (
      campaignAddress: Address,
      requestAmount: string,
      requestDestination: Address
    ) {
      console.log(
        `createRequest for ${requestAmount} ETH for vendor at ${requestDestination}`
      );
      setStatus("loading");
      try {
        const [from] = await web3.eth.getAccounts();

        const campaign = await getCampaignInstance(campaignAddress);

        await campaign.methods
          .createRequest(web3.utils.toWei(requestAmount), requestDestination)
          .send({ from });
        // await asyncConfirm();

        setStatusTimeout("success");

        await getSummary(campaignAddress);
        return true;
      } catch (error: any) {
        if (typeof error === "string") setErrorTimeout(error);
        else if (typeof error?.message === "string")
          setErrorTimeout(error.message);
        else throw error;
      }
    },
    [getSummary, setErrorTimeout, setStatusTimeout]
  );

  const createCampaign = useCallback(
    async function (minContribution: number) {
      console.log(`createCampaign minContribution: ${minContribution}`);
      setStatus("loading");
      try {
        const [from] = await web3.eth.getAccounts();

        await CampaingFactory.methods
          .createContract(minContribution)
          .send({ from });
        // await asyncConfirm();

        setStatusTimeout("success");

        await loadCampaigns();
        return true;
      } catch (error: any) {
        if (typeof error === "string") setErrorTimeout(error);
        else if (typeof error?.message === "string")
          setErrorTimeout(error.message);
        else throw error;
      }
    },
    [loadCampaigns, setErrorTimeout, setStatusTimeout]
  );

  const contribute = useCallback(
    async function (contribution: string, campaignAddress: Address) {
      console.log(
        `contribute ${contribution} to campaign at ${campaignAddress}`
      );
      setStatus("loading");
      try {
        const [from] = await web3.eth.getAccounts();

        const campaign = await getCampaignInstance(campaignAddress);
        console.log("contribution", web3.utils.toWei(contribution));

        await campaign.methods
          .contribute()
          .send({ from, value: web3.utils.toWei(contribution) });
        // await asyncConfirm();

        setStatusTimeout("success");

        await getSummary(campaignAddress);
        return true;
      } catch (error: any) {
        if (typeof error === "string") setErrorTimeout(error);
        else if (typeof error?.message === "string")
          setErrorTimeout(error.message);
        else throw error;
      }
    },
    [getSummary, setErrorTimeout, setStatusTimeout]
  );

  return {
    status,
    error,
    campaigns,
    loadCampaigns,
    createCampaign,
    createRequest,
    getSummary,
    contribute,
  };
};

export default useCampaigns;
