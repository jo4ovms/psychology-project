import React, { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

interface PageCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
  backButton?: boolean;
  backTo?: string;
  footer?: ReactNode;
  footerAlign?: "left" | "center" | "right" | "space-between";
  elevation?: number;
  noPadding?: boolean;
  children: ReactNode;
}

const PageCard: React.FC<PageCardProps> = ({
  title,
  subtitle,
  icon,
  headerAction,
  backButton = false,
  backTo,
  footer,
  footerAlign = "right",
  elevation = 2,
  noPadding = false,
  children,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <StyledCard elevation={elevation}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {backButton && (
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
            {icon && <Box sx={{ mr: 1, display: "flex" }}>{icon}</Box>}
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </Box>
        }
        subheader={subtitle}
        action={headerAction}
        sx={{
          pb: subtitle ? 1 : 2,
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        }}
      />

      {subtitle && <Divider />}

      <CardContent
        sx={{
          flexGrow: 1,
          padding: noPadding ? 0 : undefined,
          "&:last-child": {
            paddingBottom: noPadding ? 0 : theme.spacing(2),
          },
        }}
      >
        {children}
      </CardContent>

      {footer && (
        <>
          <Divider />
          <CardActions
            sx={{
              padding: theme.spacing(2),
              justifyContent: footerAlign,
            }}
          >
            {footer}
          </CardActions>
        </>
      )}
    </StyledCard>
  );
};

export default PageCard;
