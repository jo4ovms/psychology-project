import React from "react";
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  variant?: "text" | "outlined" | "contained";
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ActionButton[];
  icon?: React.ReactNode;
  backTo?: string;
  showBackButton?: boolean;
  elevation?: number;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  icon,
  backTo,
  showBackButton = false,
  elevation = 0,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <Paper
      elevation={elevation}
      sx={{
        mb: 3,
        p: theme.spacing(2, 3),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return isLast ? (
              <Typography
                key={crumb.label}
                color="text.primary"
                variant="body2"
              >
                {crumb.label}
              </Typography>
            ) : (
              <MuiLink
                key={crumb.label}
                component={RouterLink}
                to={crumb.path || "#"}
                color="inherit"
                variant="body2"
                underline="hover"
              >
                {crumb.label}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {showBackButton && (
            <Tooltip title="Voltar">
              <IconButton
                onClick={handleBack}
                size="small"
                sx={{ mr: 1, ml: -1 }}
                aria-label="voltar"
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}

          {icon && (
            <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
              {icon}
            </Box>
          )}

          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {actions && actions.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignSelf: { xs: "stretch", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "contained"}
                color={action.color || "primary"}
                onClick={action.onClick}
                startIcon={action.icon}
                fullWidth={isMobile}
                size={isMobile ? "medium" : "small"}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PageHeader;
