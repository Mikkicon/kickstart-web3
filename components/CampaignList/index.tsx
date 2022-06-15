import {
  Button,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Link from "next/link";

const CampaignList = ({
  campaigns = [null],
}: {
  campaigns?: Array<string | null>;
}) => {
  return (
    <Stack gap={3}>
      {campaigns.map((campaign, idx) => (
        <Card key={idx}>
          <CardContent>
            {campaign ? (
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {campaign}
              </Typography>
            ) : (
              <Skeleton animation="wave" variant="text" />
            )}
            <Typography variant="h5" component="div"></Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
          </CardContent>
          <CardActions>
            {campaign ? (
              <Link href={`/campaigns/${campaign}`}>View Campaign</Link>
            ) : (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={100}
                height={30}
              />
            )}
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
};

export default CampaignList;
