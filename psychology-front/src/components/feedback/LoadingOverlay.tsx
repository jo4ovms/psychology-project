import React from "react";
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  Paper,
} from "@mui/material";

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = "Carregando...",
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
        {message && (
          <Typography
            variant="h6"
            sx={{ mt: 2, color: "white", textAlign: "center" }}
          >
            {message}
          </Typography>
        )}
      </Backdrop>
    );
  }

  return open ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
        width: "100%",
        position: "relative",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          borderRadius: 2,
        }}
      >
        <CircularProgress />
        {message && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  ) : null;
};

export default LoadingOverlay;
