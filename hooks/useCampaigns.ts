import { useCallback, useEffect, useState } from "react";
import { AbiItem } from "web3-utils/types";
import CampaingFactory from "../ethereum/factory";
import getCampaignInstance from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import {
  Address,
  ContractRequestItem,
  RequestItem,
  Status,
  SummaryItem,
} from "../misc/types";
import { asyncConfirm, formatRequests, formatSummary } from "../misc/utils";

const useCampaigns = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const [campaigns, setCampaigns] = useState<string[]>();
  const [currentAccount, setCurrentAccount] = useState<Address>();

  useEffect(() => {
    listenAccountChange();
  }, []);

  function listenAccountChange() {
    window.ethereum?.on("accountsChanged", function () {
      web3.eth
        .getAccounts()
        .then(([account]) => setCurrentAccount(account as Address));
    });
  }

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

  const isManagerOfCampaign = useCallback(
    async function (campaignAddress: Address): Promise<boolean> {
      const campaign = await getCampaignInstance(campaignAddress);
      const manager = await campaign.methods
        .manager()
        .call()
        .catch(setErrorTimeout);

      const [from] = await web3.eth.getAccounts();

      return manager === from;
    },
    [setErrorTimeout]
  );

  const hasApproved = useCallback(
    async function (campaignAddress: Address): Promise<boolean> {
      const campaign = await getCampaignInstance(campaignAddress);
      const [userAddress] = await web3.eth.getAccounts();

      const hasApproved = await campaign.methods
        .approvers(userAddress)
        .call()
        .catch(setErrorTimeout);

      return hasApproved;
    },
    [setErrorTimeout]
  );

  const getRequests = useCallback(
    async function (campaignAddress: Address) {
      const campaign = await getCampaignInstance(campaignAddress);
      const requestsAmount = await campaign.methods
        .getRequestsAmount()
        .call()
        .catch(setErrorTimeout);

      // TODO make amountApprovers field public in Campaign.sol
      // and re-write to avoid using whole summary
      const [totalApprovers] = (await getSummary(campaignAddress)).filter(
        (a) => a.id === "approversAmount"
      );

      // @ts-ignore
      const indecies = [...Array(parseInt(requestsAmount)).keys()];
      const requestsPromises = indecies.map((n) =>
        campaign.methods.requests(n).call()
      );
      const requests = await Promise.allSettled(requestsPromises);

      const onlyFulfilled = requests.filter(
        (req) => req.status === "fulfilled"
      ) as PromiseFulfilledResult<ContractRequestItem>[];

      return formatRequests(
        onlyFulfilled.map((req) => req.value),
        parseInt(totalApprovers.value)
      );
    },
    [getSummary, setErrorTimeout]
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

  const approveRequest = useCallback(
    async function (campaignAddress: Address, requestIndex: number) {
      setStatus("loading");

      try {
        const campaign = await getCampaignInstance(campaignAddress);

        const [from] = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(requestIndex).send({ from });
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

  const finalizeRequest = useCallback(
    async function (campaignAddress: Address, requestIndex: number) {
      setStatus("loading");
      try {
        const campaign = await getCampaignInstance(campaignAddress);

        const [from] = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(requestIndex).send({ from });
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
    currentAccount,
    loadCampaigns,
    createCampaign,
    createRequest,
    getSummary,
    contribute,
    getRequests,
    hasApproved,
    approveRequest,
    finalizeRequest,
    isManagerOfCampaign,
  };
};

export default useCampaigns;
