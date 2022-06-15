import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Contribute from "../../../components/Contribute";
import Layout from "../../../components/Layout";
import campaign from "../../../ethereum/campaign";
import useCampaigns from "../../../hooks/useCampaigns";
import {
  Address,
  CampaignDetailsRouteQuery,
  SummaryItem,
} from "../../../misc/types";

const CampaignDetails = () => {
  const router = useRouter();
  const { address } = router.query as CampaignDetailsRouteQuery;
  const { getSummary } = useCampaigns();
  const [summary, setSummary] = useState<SummaryItem[]>();

  const loadSummary = useCallback(
    async function () {
      if (!address || Array.isArray(address)) return;
      const summary = await getSummary(address);
      setSummary(summary);
    },
    [getSummary, address]
  );

  useEffect(() => {
    loadSummary();
  }, [loadSummary, address]);

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid container item md={9} spacing={2}>
          {summary
            ? summary.map(({ name, value, description, link }) => (
                <Grid item key={name} xs={12} sm={12} md={6}>
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
                    {link ? (
                      <CardActions>
                        <Link href={`${router.asPath}/${link.href}`}>
                          <Button>{link.name}</Button>
                        </Link>
                      </CardActions>
                    ) : null}
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
        <Grid item md={3}>
          <Contribute address={address} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CampaignDetails;
