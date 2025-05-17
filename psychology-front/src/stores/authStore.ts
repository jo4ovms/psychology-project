import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User, UserRole } from "../types/models";
import { AuthResponseDTO, ChangePasswordDTO, LoginDTO } from "../types/dtos";
import authService from "../services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  changePassword: (passwordData: ChangePasswordDTO) => Promise<void>;
  clearError: () => void;

  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: authService.getCurrentUser(),
        isAuthenticated: authService.isAuthenticated(),
        isLoading: false,
        error: null,

        login: async (credentials: LoginDTO) => {
          set({ isLoading: true, error: null });
          try {
            const authResponse: AuthResponseDTO = await authService.login(
              credentials
            );
            set({
              user: authResponse.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Falha ao realizar login";
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        logout: () => {
          authService.logout();
          set({
            user: null,
            isAuthenticated: false,
          });
        },

        getProfile: async () => {
          set({ isLoading: true, error: null });
          try {
            const user = await authService.getProfile();
            set({ user, isLoading: false });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Falha ao obter perfil";
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        changePassword: async (passwordData: ChangePasswordDTO) => {
          set({ isLoading: true, error: null });
          try {
            await authService.changePassword(passwordData);
            set({ isLoading: false });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Falha ao alterar senha";
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        clearError: () => {
          set({ error: null });
        },

        hasRole: (role: UserRole) => {
          const { user } = get();
          return !!user && user.role === role;
        },
      }),
      {
        name: "auth-storage",

        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export default useAuthStore;
