import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Paper, Divider, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import BugReportIcon from "@mui/icons-material/BugReport";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: "100%",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <BugReportIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Algo deu errado
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3 }}>
              Ocorreu um erro ao renderizar este componente.
            </Alert>

            <Typography variant="body1" paragraph>
              Tente recarregar esta parte da aplicação ou retornar à página
              anterior.
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                startIcon={<RefreshIcon />}
              >
                Recarregar Página
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReset}
              >
                Tentar Novamente
              </Button>
            </Box>

            {process.env.NODE_ENV === "development" && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6">
                  Detalhes do Erro (Apenas Desenvolvimento):
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "grey.100",
                    color: "error.main",
                    overflow: "auto",
                    borderRadius: 1,
                    fontSize: "0.875rem",
                    maxHeight: 200,
                  }}
                >
                  {error?.toString()}
                  {errorInfo?.componentStack}
                </Box>
              </>
            )}
          </Paper>
        </Box>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
