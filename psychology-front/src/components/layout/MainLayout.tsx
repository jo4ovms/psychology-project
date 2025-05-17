import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NoteIcon from "@mui/icons-material/Note";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

import { useAuth } from "../../contexts/AuthContext";
import { useTheme as useAppTheme } from "../../themes/ThemeProvider";
import { UserRole } from "../../types/models";

import Footer from "./Footer";

const drawerWidth = 280;

interface NavItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    text: "Pacientes",
    path: "/patients",
    icon: <PersonIcon />,
  },
  {
    text: "Agenda",
    path: "/appointments",
    icon: <CalendarMonthIcon />,
  },
  {
    text: "Calendário",
    path: "/calendar",
    icon: <CalendarMonthIcon />,
  },
  {
    text: "Consultas",
    path: "/consultations",
    icon: <NoteIcon />,
    allowedRoles: [UserRole.PROFISSIONAL_SAUDE, UserRole.ADMIN],
  },
  {
    text: "Administração",
    path: "/admin",
    icon: <SettingsIcon />,
    allowedRoles: [UserRole.ADMIN],
  },
];

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useAppTheme();
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(!isMobile);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    setExpanded(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setExpanded(!expanded);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleUserMenuClose();
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    handleUserMenuClose();
    logout();
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.some((role) => hasRole(role));
  });

  const drawerContent = (
    <Box sx={{ overflow: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Consultório Psicológico
        </Typography>
      </Box>
      <Divider />
      <List>
        {filteredNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: expanded ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: expanded ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {expanded && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: {
            md: expanded
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - 64px)`,
          },
          ml: { md: expanded ? `${drawerWidth}px` : 64 },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {filteredNavItems.find((item) => item.path === location.pathname)
              ?.text || "Dashboard"}
          </Typography>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
              >
                {user.name}
              </Typography>

              <Tooltip title="Conta">
                <IconButton
                  onClick={handleUserMenuOpen}
                  size="small"
                  aria-controls={userMenuOpen ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen ? "true" : undefined}
                  sx={{ p: 0 }}
                >
                  <Avatar alt={user.name}>
                    {user.name.substring(0, 1).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                MenuListProps={{
                  "aria-labelledby": "account-button",
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  Perfil
                </MenuItem>
                <MenuItem onClick={toggleTheme}>
                  <ListItemIcon>
                    {themeMode === "dark" ? (
                      <LightModeIcon fontSize="small" />
                    ) : (
                      <DarkModeIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  {themeMode === "dark" ? "Modo Claro" : "Modo Escuro"}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogoutClick}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: expanded ? drawerWidth : 64,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: expanded ? drawerWidth : 64,
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 3,
          width: {
            md: expanded
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - 64px)`,
          },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 2 }}>
          <Outlet />
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
