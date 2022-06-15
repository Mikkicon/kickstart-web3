import { useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import useCampaigns from "../../hooks/useCampaigns";
import Snackbar from "../../components/Snackbar";

type FormType = {
  contribution: string;
};

const New = () => {
  const router = useRouter();
  const { status, error, createCampaign } = useCampaigns();
  const { register, handleSubmit } = useForm<FormType>();

  async function onSubmit({ contribution }: FormType) {
    await createCampaign(parseFloat(contribution));
    router.push("/");
  }

  return (
    <Layout>
      <Box>
        <FormControl>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <TextField
                id="outlined-basic"
                required
                type="number"
                label="Minimum Contribution"
                variant="outlined"
                {...register("contribution")}
                InputProps={{
                  endAdornment: <Typography paddingLeft={1}>WEI</Typography>,
                }}
              />
            </Box>
            <LoadingButton
              loading={status === "loading"}
              loadingPosition="start"
              type="submit"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              Save
            </LoadingButton>
          </form>
        </FormControl>
        <Snackbar status={status} message={error} />
      </Box>
    </Layout>
  );
};
export default New;
