import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, UserRole } from "../types/models";
import { LoginDTO, ChangePasswordDTO } from "../types/dtos";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "./ToastContext";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  changePassword: (passwordData: ChangePasswordDTO) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const {
    user,
    isAuthenticated,
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    hasRole: storeHasRole,
    changePassword: storeChangePassword,
    getProfile,
  } = useAuthStore();

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated && !user) {
          await getProfile();
        }
      } catch {
        storeLogout();
      } finally {
        setInitialLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, getProfile, storeLogout]);

  useEffect(() => {
    if (
      !initialLoading &&
      !isAuthenticated &&
      !location.pathname.startsWith("/login")
    ) {
      const from = location.pathname;
      navigate("/login", { state: { from }, replace: true });
    }
  }, [isAuthenticated, initialLoading, location.pathname, navigate]);

  const login = async (credentials: LoginDTO) => {
    try {
      await storeLogin(credentials);

      const state = location.state as { from?: string } | null;
      const from = state?.from || "/dashboard";

      navigate(from, { replace: true });
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Falha ao realizar login";

      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    storeLogout();
    navigate("/login");
    toast.info("Logout realizado com sucesso");
  };

  const changePassword = async (passwordData: ChangePasswordDTO) => {
    try {
      await storeChangePassword(passwordData);
      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Falha ao alterar senha";

      toast.error(errorMessage);
      throw error;
    }
  };

  const contextValue: AuthContextProps = {
    user,
    isAuthenticated,
    isLoading: isLoading || initialLoading,
    login,
    logout,
    hasRole: storeHasRole,
    changePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
