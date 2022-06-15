import { Snackbar as MUISnackbar, Slide, Alert } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { Status } from "../../misc/types";

const Snackbar = ({
  status,
  message,
}: {
  status?: Status;
  message?: string;
}) => {
  const [isOpen, setOpen] = useState<boolean>(
    status === "error" || status === "success"
  );

  useEffect(() => {
    setOpen(status === "error" || status === "success");
  }, [status]);

  return (
    <MUISnackbar
      open={isOpen}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      TransitionComponent={(props) => <Slide {...props} direction="up" />}
      autoHideDuration={5000}
    >
      {status === "error" ? (
        <Alert severity="error">{message}</Alert>
      ) : (
        <Alert severity="success">Success</Alert>
      )}
    </MUISnackbar>
  );
};

export default memo(Snackbar);
