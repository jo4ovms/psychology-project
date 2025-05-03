import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
      light: "#6692ff",
      dark: "#0039b8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#14b8a6",
      light: "#6aebd8",
      dark: "#008876",
      contrastText: "#ffffff",
    },
    success: {
      main: "#10b981",
      light: "#5feb95",
      dark: "#00853d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#ffd04f",
      dark: "#c36e00",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#ff7875",
      dark: "#b20017",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6",
      light: "#74b1ff",
      dark: "#0055c3",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#f8fafc",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
