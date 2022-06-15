import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import campaign from "../../ethereum/campaign";
import useCampaigns from "../../hooks/useCampaigns";
import { SummaryItem } from "../../misc/types";

const CampaignDetails = () => {
  const router = useRouter();
  const { getSummary } = useCampaigns();
  const [summary, setSummary] = useState<SummaryItem[]>();

  const loadSummary = useCallback(
    async function () {
      if (!router.query.address || Array.isArray(router.query.address)) return;
      const summary = await getSummary(router.query.address);
      setSummary(summary);
    },
    [getSummary, router.query.address]
  );

  useEffect(() => {
    console.log("CampaignDetails mount", summary);
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSummary, router.query.address]);

  useEffect(() => {
    console.log("CampaignDetails update", summary);
  });

  return (
    <Layout>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {summary
          ? summary.map(({ name, value, description }) => (
              <Grid item key={name} xs={2} sm={4} md={6}>
                <Card>
                  <CardContent>
                    <Typography sx={{ fontSize: 20 }} color="text.secondary">
                      {name}
                    </Typography>

                    <Typography
                      variant="h5"
                      style={{ overflowWrap: "break-word" }}
                    >
                      {value}
                    </Typography>

                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : null}
      </Grid>
    </Layout>
  );
};

export default CampaignDetails;
