import { LoadingButton } from "@mui/lab";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import useCampaigns from "../../hooks/useCampaigns";
import { Address, RequestRow, CampaignStatus } from "../../misc/types";

export const ApproveButton = ({
  params,
}: {
  params: GridRenderCellParams<any, any, any>;
}) => {
  const [approved, setApproved] = useState<boolean>();
  const [isManager, setIsManager] = useState<boolean>();
  const {
    status,
    currentAccount,
    approveRequest,
    hasApproved,
    isManagerOfCampaign,
  } = useCampaigns();
  const router = useRouter();
  const campaignAddress = router.query.address;
  const { id, status: requestStatus } = (params.row as RequestRow) || {};

  const onClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation(); // don't select this row after clicking

    const requestIndex = parseInt(id) - 1;
    await approveRequest(campaignAddress as Address, requestIndex);
  };

  async function loadHasAlreadyApproved() {
    const campaignAddress = router.query.address;
    if (!campaignAddress || Array.isArray(campaignAddress)) return;

    const approved = await hasApproved(campaignAddress as Address);
    setApproved(approved);
  }

  const getIsManager = useCallback(
    async function () {
      if (Array.isArray(campaignAddress))
        throw Error("campaignAddress is array");
      const isManagerResult = await isManagerOfCampaign(
        campaignAddress as Address
      );
      setIsManager(isManagerResult);
    },
    [campaignAddress, isManagerOfCampaign]
  );

  useEffect(() => {
    if (campaignAddress) getIsManager();
  }, [campaignAddress, currentAccount, getIsManager]);

  useEffect(() => {
    loadHasAlreadyApproved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (requestStatus === CampaignStatus.finalized) return null;
  if (approved === undefined || approved === true) return null;
  if (isManager === undefined || isManager === true) return null;
  return (
    <LoadingButton
      loading={status === "loading"}
      loadingPosition="start"
      startIcon={<CheckCircleOutlineIcon />}
      variant="outlined"
      color="success"
      onClick={onClick}
    >
      Approve
    </LoadingButton>
  );
};

export const FinalizeButton = ({
  params,
}: {
  params: GridRenderCellParams<any, any, any>;
}) => {
  const [isManager, setIsManager] = useState<boolean>();
  const { status, currentAccount, finalizeRequest, isManagerOfCampaign } =
    useCampaigns();
  const router = useRouter();
  const { id, status: requestStatus } = (params.row as RequestRow) || {};
  const campaignAddress = router.query.address;

  const onClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation(); // don't select this row after clicking

    const requestIndex = parseInt(id as string) - 1;
    await finalizeRequest(campaignAddress as Address, requestIndex);
  };

  const getIsManager = useCallback(
    async function () {
      if (Array.isArray(campaignAddress))
        throw Error("campaignAddress is array");
      const isManagerResult = await isManagerOfCampaign(
        campaignAddress as Address
      );
      setIsManager(isManagerResult);
    },
    [campaignAddress, isManagerOfCampaign]
  );

  useEffect(() => {
    if (campaignAddress) getIsManager();
  }, [campaignAddress, currentAccount, getIsManager]);

  if (requestStatus === CampaignStatus.finalized) return null;
  if (isManager === undefined || isManager === false) return null;

  return (
    <LoadingButton
      loading={status === "loading"}
      loadingPosition="start"
      startIcon={<CheckCircleOutlineIcon />}
      variant="outlined"
      color="error"
      onClick={onClick}
    >
      Finalize
    </LoadingButton>
  );
};
