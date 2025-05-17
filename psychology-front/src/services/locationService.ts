import { apiClient } from "./api/apiClient";
import { City, Location, State } from "../types/models";

export const locationService = {
  async getLocationByCep(cep: string): Promise<Location> {
    try {
      const cleanedCep = cep.replace(/\D/g, "");
      const response = await apiClient.get<Location>(
        `/locations/cep/${cleanedCep}`
      );
      return response.data;
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
