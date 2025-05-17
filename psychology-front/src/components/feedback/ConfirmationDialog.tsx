import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export type ConfirmationDialogType = "delete" | "warning" | "info" | "confirm";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: ConfirmationDialogType;
  loading?: boolean;
  maxWidth?: "xs" | "sm" | "md";
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  onConfirm,
  onCancel,
  type = "confirm",
  loading = false,
  maxWidth = "sm",
}) => {
  const theme = useTheme();

  const getTypeConfig = () => {
    switch (type) {
      case "delete":
        return {
          icon: <DeleteIcon fontSize="large" />,
          color: theme.palette.error.main,
          confirmColor: "error" as const,
          confirmVariant: "contained" as const,
          confirmText: confirmButtonText || "Excluir",
        };
      case "warning":
        return {
          icon: <WarningIcon fontSize="large" />,
          color: theme.palette.warning.main,
          confirmColor: "warning" as const,
          confirmVariant: "contained" as const,
          confirmText: confirmButtonText || "Prosseguir",
        };
      case "info":
        return {
          icon: <InfoOutlinedIcon fontSize="large" />,
          color: theme.palette.info.main,
          confirmColor: "primary" as const,
          confirmVariant: "outlined" as const,
          confirmText: confirmButtonText || "Entendi",
        };
      default:
        return {
          icon: <HelpOutlineIcon fontSize="large" />,
          color: theme.palette.primary.main,
          confirmColor: "primary" as const,
          confirmVariant: "contained" as const,
          confirmText: confirmButtonText || "Confirmar",
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="confirmation-dialog-title"
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ pr: 8 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ color: typeConfig.color, mr: 2 }}>{typeConfig.icon}</Box>
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {typeof message === "string" ? (
          <DialogContentText>{message}</DialogContentText>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onCancel} variant="text" disabled={loading}>
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          color={typeConfig.confirmColor}
          variant={typeConfig.confirmVariant}
          disabled={loading}
          autoFocus
        >
          {typeConfig.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
