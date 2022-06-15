import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "../../../../components/Layout";
import useCampaigns from "../../../../hooks/useCampaigns";
import { CampaignDetailsRouteQuery, SummaryItem } from "../../../../misc/types";
import { requestsColDef } from "../../../../misc/utils";

const Requests: NextPage = () => {
  const router = useRouter();
  const { address } = router.query as CampaignDetailsRouteQuery;
  const { getRequests } = useCampaigns();
  const [requests, setRequests] = useState<any[]>([]);

  const loadRequests = useCallback(
    async function () {
      if (!address || Array.isArray(address)) return;
      const requests = await getRequests(address);
      setRequests(requests);
    },
    [address, getRequests]
  );

  useEffect(() => {
    loadRequests();
  }, [getRequests, address, loadRequests]);

  return (
    <Layout>
      <Link href={`${router.asPath}/new`}>
        <Button>Create request</Button>
      </Link>
      <div style={{ height: "100vh", width: "100%" }}>
        <DataGrid rows={requests} columns={requestsColDef} />
      </div>
    </Layout>
  );
};

export default Requests;
