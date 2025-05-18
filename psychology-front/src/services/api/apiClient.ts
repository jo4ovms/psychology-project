import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const ERROR_TOAST_EXCEPTIONS = [
  {
    urlPattern: "/consultations/patient/\\d+/history",
    statusCode: 404,
    messagePattern: "Não foram encontradas consultas para o paciente",
  },
];

const shouldSuppressErrorToast = (error: AxiosError): boolean => {
  if (!error.response || !error.config?.url) return false;

  const { status } = error.response;
  const url = error.config.url;

  const errorMessage = error.response.data?.message || "";
  const messageStr = Array.isArray(errorMessage)
    ? errorMessage.join(" ")
    : errorMessage;

  return ERROR_TOAST_EXCEPTIONS.some((exception) => {
    const urlMatches = new RegExp(exception.urlPattern).test(url);
    const statusMatches = exception.statusCode === status;
    const messageMatches = exception.messagePattern
      ? new RegExp(exception.messagePattern).test(messageStr)
      : true;

    return urlMatches && statusMatches && messageMatches;
  });
};

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
      if (!shouldSuppressErrorToast(error) && error.response) {
        const { status } = error.response;
        const url = error.config?.url || "";

        const isConsultationPermissionError =
          status === 403 &&
          (url.includes("/consultations/") || url.includes("/consultations"));

        if (
          status === 401 ||
          (status === 403 && !isConsultationPermissionError)
        ) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_info");

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
            toast.error("Sua sessão expirou. Por favor, faça login novamente.");
          }
        } else {
          switch (status) {
            case 400:
              toast.error("Erro na requisição. Verifique os dados enviados.");
              break;
            case 403:
              if (isConsultationPermissionError) {
              } else {
                toast.error("Você não tem permissão para realizar esta ação.");
              }
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
        }
      } else if (error.request && !shouldSuppressErrorToast(error)) {
        toast.error(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      } else if (!shouldSuppressErrorToast(error)) {
        toast.error("Ocorreu um erro ao processar sua solicitação.");
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const apiClient = createApiClient();

export default createApiClient;
