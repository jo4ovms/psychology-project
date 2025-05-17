import React from "react";
import { Box, Typography, Divider, Link } from "@mui/material";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0";

  return (
    <Box sx={{ mt: "auto", pt: 2 }}>
      <Divider />
      <Box
        sx={{
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {currentYear} Consultório Psicológico. Todos os direitos
          reservados.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link
            href="#"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            Política de Privacidade
          </Link>
          <Link
            href="#"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            Termos de Uso
          </Link>
          <Typography variant="body2" color="text.secondary">
            v{appVersion}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
