import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";

import Layout from "../../../../components/Layout";
import useCampaigns from "../../../../hooks/useCampaigns";
import { CampaignDetailsRouteQuery, SummaryItem } from "../../../../misc/types";
import Link from "next/link";

const Requests: NextPage = () => {
  const router = useRouter();
  const { address } = router.query as CampaignDetailsRouteQuery;
  const { getSummary } = useCampaigns();
  const [requests, setRequests] = useState<any[]>();
  console.log(router);

  const loadSummary = useCallback(
    async function () {
      if (!address || Array.isArray(address)) return;
      const summary = await getSummary(address);
      setRequests(summary);
    },
    [getSummary, address]
  );

  useEffect(() => {
    // loadSummary();
  }, [loadSummary, address]);

  return (
    <Layout>
      <Typography>Hi</Typography>
      <Link href={`${router.asPath}/new`}>
        <Button>Create request</Button>
      </Link>
      <Stack>{requests}</Stack>
    </Layout>
  );
};

export default Requests;
