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
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const NotFoundPage: React.FC = () => {
  const theme = useTheme();

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
          <SentimentDissatisfiedIcon
            sx={{
              fontSize: 120,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />

          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom>
            Página não encontrada
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 600 }}
          >
            Desculpe, a página que você está procurando não existe ou foi
            movida. Verifique o endereço digitado ou utilize as opções abaixo
            para navegar pelo sistema.
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

export default NotFoundPage;
