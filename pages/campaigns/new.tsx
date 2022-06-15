import Layout from "../../components/Layout";
import FormControl from "@mui/material/FormControl";
import {
  FormHelperText,
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";

const New = () => {
  const { register, handleSubmit } = useForm();

  function onSubmit(data: any) {
    console.log(data);
  }

  return (
    <Layout>
      <Box>
        <FormControl>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="outlined-basic"
              required
              label="Minimum Contribution"
              variant="outlined"
              {...register("contribution")}
              InputProps={{
                endAdornment: <Typography paddingLeft={1}>WEI</Typography>,
              }}
            />
            <Button type="submit">Submit</Button>
          </form>
        </FormControl>
      </Box>
    </Layout>
  );
};
export default New;
