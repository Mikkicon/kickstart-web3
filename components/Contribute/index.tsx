import { LoadingButton } from "@mui/lab";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import useCampaigns from "../../hooks/useCampaigns";
import Snackbar from "../Snackbar";
import { Address } from "../../misc/types";

type FormType = {
  contribution: string;
};

const Contribute = ({ address }: { address: Address }) => {
  const router = useRouter();
  const { status, error, contribute } = useCampaigns();
  const { register, handleSubmit } = useForm<FormType>();

  async function onSubmit({ contribution }: FormType) {
    const isSuccess = await contribute(contribution, address);
    if (isSuccess) router.reload();
  }

  return (
    <Box>
      <FormControl>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography>Contribute to campaign</Typography>
          <Box marginTop={3}>
            <TextField
              id="outlined-basic"
              required
              type="decimal"
              label="Contribute"
              variant="outlined"
              {...register("contribution")}
              InputProps={{
                endAdornment: <Typography paddingLeft={1}>Ether</Typography>,
              }}
            />
          </Box>
          <LoadingButton
            loading={status === "loading"}
            loadingPosition="start"
            type="submit"
            startIcon={<MonetizationOnIcon />}
            variant="outlined"
          >
            Contribute
          </LoadingButton>
        </form>
      </FormControl>
      <Snackbar status={status} message={error} />
    </Box>
  );
};
export default Contribute;
