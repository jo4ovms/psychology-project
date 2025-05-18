import { apiClient } from "./api/apiClient";
import {
  AuthResponseDTO,
  ChangePasswordDTO,
  LoginDTO,
  RegisterUserDTO,
} from "../types/dtos";
import { User } from "../types/models";
import { AxiosError } from "axios";

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
    try {
      const response = await apiClient.post<AuthResponseDTO>(
        "/auth/login",
        credentials
      );

      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user_info", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status === 401) {
        throw new Error(
          "Email ou senha inválidos. Verifique suas credenciais."
        );
      }

      throw error;
    }
  },

  async register(userData: RegisterUserDTO): Promise<User> {
    const response = await apiClient.post<User>("/users/register", userData);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>("/users/profile");
    return response.data;
  },

  async changePassword(
    passwordData: ChangePasswordDTO
  ): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(
      "/users/profile/change-password",
      passwordData
    );
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },

  getCurrentUser(): User | null {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  },

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === role;
  },
};

export default authService;
