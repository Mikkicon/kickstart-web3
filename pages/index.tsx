import type { NextPage } from "next";
import { useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import CampaignList from "../components/CampaignList";
import Layout from "../components/Layout";
import useCampaigns from "../hooks/useCampaigns";
import Link from "next/link";

type HomeProps = {
  campaigns?: string[];
};
const Home: NextPage<HomeProps> = () => {
  const { campaigns, loadCampaigns } = useCampaigns();

  useEffect(() => {
    setTimeout(() => {
      loadCampaigns();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item sm={8}>
          <Typography variant="h5">Open Campaigns</Typography>
          <CampaignList campaigns={campaigns} />
        </Grid>
        <Grid item sm={3}>
          <Box display="flex" justifyContent="flex-end">
            <Link href={"/campaigns/new"}>
              <Button variant="contained" startIcon={<AddIcon />}>
                Create Campaign
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;
