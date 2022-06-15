import { createTheme } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    background: {
      default: grey[800],
    },
    primary: {
      main: blue[500],
      dark: grey[500],
    },
    mode: "dark",
  },
});

export default darkTheme;
