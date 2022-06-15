import { Button, CardActions, CardContent, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

const CampaignList = ({ campaigns }: { campaigns: string[] }) => {
  return (
    <Stack gap={3}>
      {campaigns.map((campaign) => (
        <Card key={campaign} sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {campaign}
            </Typography>
            <Typography variant="h5" component="div"></Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View Campaign</Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
};

export default CampaignList;
