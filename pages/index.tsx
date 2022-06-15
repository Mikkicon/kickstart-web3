import type { NextPage } from "next";

import CampaingFactory from "../ethereum/factory";
import { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CampaignList from "../components/CampaignList";
import Layout from "../components/Layout";

type HomeProps = {
  campaigns?: string[];
};
const Home: NextPage<HomeProps> = () => {
  const [campaigns, setCampaigns] = useState<string[]>([]);

  async function _setCampaigns() {
    const getContracts = await CampaingFactory.methods.getContracts();
    const campaigns = await getContracts.call().catch(console.error);
    if (campaigns) setCampaigns(campaigns);
  }

  useEffect(() => {
    _setCampaigns();
  }, []);

  return (
    <Layout>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item sm={8}>
          <Typography variant="h5">Open Campaigns</Typography>
          <CampaignList
            campaigns={[...campaigns, ...campaigns, ...campaigns]}
          />
        </Grid>
        {/* <ul>
          {campaigns && campaigns.map((camp) => <li key={camp}>{camp}</li>)}
        </ul> */}
        <Grid item sm={3}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" startIcon={<AddIcon />}>
              Create Campaign
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

// export const getServerSideProps = async (): Promise<{props: HomeProps}> => {
//   const getContracts = await CampaingFactory.methods.getContracts()
//   const campaigns = (await getContracts.call().catch(console.error)) || null
//   return {props: {campaigns}}
// }

export default Home;
