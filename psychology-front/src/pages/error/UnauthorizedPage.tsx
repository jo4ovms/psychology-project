import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../../contexts/AuthContext";

const UnauthorizedPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <LockIcon
            sx={{
              fontSize: 120,
              color: theme.palette.error.main,
              mb: 2,
            }}
          />

          <Typography variant="h1" component="h1" gutterBottom>
            403
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom>
            Acesso Não Autorizado
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 600 }}
          >
            Desculpe, {user?.name ? `${user.name.split(" ")[0]}` : ""}, você não
            tem permissão para acessar esta página. Se acredita que isso é um
            erro, entre em contato com o administrador do sistema.
          </Typography>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/dashboard"
              startIcon={<HomeIcon />}
            >
              Ir para o Dashboard
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
            >
              Voltar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;
