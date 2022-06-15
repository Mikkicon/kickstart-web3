import { useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { Box, Button, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CreateIcon from "@mui/icons-material/Create";
import { useRouter } from "next/router";

import Layout from "../../../../components/Layout";
import useCampaigns from "../../../../hooks/useCampaigns";
import Snackbar from "../../../../components/Snackbar";
import { Address, CampaignDetailsRouteQuery } from "../../../../misc/types";
import Link from "next/link";

type FormType = {
  amount: string;
  recipient: Address;
};

const New = () => {
  const router = useRouter();
  const { address } = router.query as CampaignDetailsRouteQuery;
  const requestsUrl = router.asPath.split("/").slice(0, -1).join("/");
  const { status, error, createRequest } = useCampaigns();
  const { register, handleSubmit } = useForm<FormType>();

  async function onSubmit({ amount, recipient }: FormType) {
    console.log(amount, recipient);

    if (!address || Array.isArray(address)) return;
    const isSuccess = await createRequest(address, amount, recipient);
    if (isSuccess) setTimeout(() => router.push(requestsUrl), 1000);
  }
  // 0x339192081F096DA84dE5d63dfB4D358e48Ef0d15
  return (
    <Layout>
      <Box>
        <Link href={requestsUrl}>
          <Button variant="outlined">Back</Button>
        </Link>
        <Typography component="h2" fontSize={30}>
          Create a request
        </Typography>
        <Box width={"50%"}>
          <FormControl fullWidth>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box marginY={3}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  required
                  type="decimal"
                  label="Amount of ether"
                  variant="outlined"
                  {...register("amount")}
                />
              </Box>
              <Box marginBottom={3}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  required
                  label="Recipient Address"
                  variant="outlined"
                  {...register("recipient")}
                />
              </Box>
              <LoadingButton
                loading={status === "loading"}
                loadingPosition="start"
                type="submit"
                startIcon={<CreateIcon />}
                variant="outlined"
              >
                Create
              </LoadingButton>
            </form>
          </FormControl>
        </Box>
        <Snackbar status={status} message={error} />
      </Box>
    </Layout>
  );
};
export default New;
