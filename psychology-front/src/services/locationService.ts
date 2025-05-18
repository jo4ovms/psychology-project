import { apiClient } from "./api/apiClient";
import { City, Location, State } from "../types/models";

interface ApiAddressResponse {
  cep: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;

  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

const formatToLocation = (data: ApiAddressResponse): Location => {
  return {
    cep: data.cep,
    street: data.street || data.logradouro || "",
    complement: data.complemento || "",
    neighborhood: data.neighborhood || data.bairro || "",
    city: data.city || data.localidade || "",
    state: data.state || data.uf || "",
    ibge: data.ibge,
    gia: data.gia,
    ddd: data.ddd,
    siafi: data.siafi,
  };
};

export const locationService = {
  async getLocationByCep(cep: string): Promise<Location> {
    try {
      const cleanedCep = cep.replace(/\D/g, "");
      const response = await apiClient.get<ApiAddressResponse>(
        `/locations/cep/${cleanedCep}`
      );

      return formatToLocation(response.data);
    } catch (error) {
      throw error;
    }
  },

  async getAllStates(): Promise<State[]> {
    try {
      const response = await apiClient.get<State[]>("/locations/states");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCitiesByState(stateAbbreviation: string): Promise<City[]> {
    try {
      const response = await apiClient.get<City[]>(
        `/locations/states/${stateAbbreviation}/cities`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default locationService;
