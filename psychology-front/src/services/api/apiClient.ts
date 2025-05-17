import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response) {
        const { status } = error.response;

        if (status === 401 || status === 403) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_info");

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
            toast.error("Sua sessão expirou. Por favor, faça login novamente.");
          }
        }

        switch (status) {
          case 400:
            toast.error("Erro na requisição. Verifique os dados enviados.");
            break;
          case 404:
            toast.error("Recurso não encontrado.");
            break;
          case 500:
            toast.error(
              "Erro interno do servidor. Tente novamente mais tarde."
            );
            break;
          default:
            if (status >= 400) {
              toast.error("Ocorreu um erro na operação. Tente novamente.");
            }
        }
      } else if (error.request) {
        toast.error(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      } else {
        toast.error("Ocorreu um erro ao processar sua solicitação.");
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const apiClient = createApiClient();

export default createApiClient;
