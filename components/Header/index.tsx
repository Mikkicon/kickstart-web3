import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href={"/"}>Kickstart</Link>
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <Link href={"/campaigns"}>Campaigns</Link>
              <Link href={"/campaigns/new"}>
                <AddIcon style={{ cursor: "pointer" }} />
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};

export default Header;
