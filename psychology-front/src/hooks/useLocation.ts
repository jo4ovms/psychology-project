import { useState, useCallback } from "react";
import { City, Location, State } from "../types/models";
import locationService from "../services/locationService";

interface UseLocationReturn {
  location: Location | null;
  states: State[];
  cities: City[];
  isLoading: boolean;
  error: string | null;

  fetchLocationByCep: (cep: string) => Promise<Location | null>;
  fetchAllStates: () => Promise<State[]>;
  fetchCitiesByState: (stateAbbreviation: string) => Promise<City[]>;
  clearLocation: () => void;
  clearError: () => void;
}

const ensureCorrectLocationFormat = (data: any): Location => {
  if (data.street && data.neighborhood && data.city && data.state) {
    return data as Location;
  }

  return {
    cep: data.cep,
    street: data.logradouro || "",
    complement: data.complemento || "",
    neighborhood: data.bairro || "",
    city: data.localidade || "",
    state: data.uf || "",
    ibge: data.ibge,
    gia: data.gia,
    ddd: data.ddd,
    siafi: data.siafi,
  };
};

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationByCep = useCallback(
    async (cep: string): Promise<Location | null> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!cep || cep.length < 8) {
          setLocation(null);
          setIsLoading(false);
          return null;
        }

        const rawLocationData = await locationService.getLocationByCep(cep);

        const locationData = ensureCorrectLocationFormat(rawLocationData);

        setLocation(locationData);
        setIsLoading(false);
        return locationData;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Não foi possível obter os dados do CEP";

        setError(errorMessage);
        setLocation(null);
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  const fetchAllStates = useCallback(async (): Promise<State[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const statesData = await locationService.getAllStates();
      setStates(statesData);
      setIsLoading(false);
      return statesData;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível obter a lista de estados";

      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  }, []);

  const fetchCitiesByState = useCallback(
    async (stateAbbreviation: string): Promise<City[]> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!stateAbbreviation) {
          setCities([]);
          setIsLoading(false);
          return [];
        }

        const citiesData = await locationService.getCitiesByState(
          stateAbbreviation
        );
        setCities(citiesData);
        setIsLoading(false);
        return citiesData;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Não foi possível obter a lista de cidades";

        setError(errorMessage);
        setCities([]);
        setIsLoading(false);
        return [];
      }
    },
    []
  );

  const clearLocation = useCallback(() => {
    setLocation(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    location,
    states,
    cities,
    isLoading,
    error,
    fetchLocationByCep,
    fetchAllStates,
    fetchCitiesByState,
    clearLocation,
    clearError,
  };
};

export default useLocation;
