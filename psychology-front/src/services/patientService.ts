import { apiClient } from "./api/apiClient";
import { CreatePatientDTO, UpdatePatientDTO } from "../types/dtos";
import { ApiResponse, Patient } from "../types/models";

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await apiClient.get<Patient[]>("/patients");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPatientById(id: number): Promise<Patient> {
    try {
      const response = await apiClient.get<Patient>(`/patients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPatientByCpf(cpf: string): Promise<Patient> {
    try {
      const response = await apiClient.get<Patient>(`/patients/cpf/${cpf}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createPatient(patient: CreatePatientDTO): Promise<Patient> {
    try {
      const response = await apiClient.post<Patient>("/patients", patient);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updatePatient(
    id: number,
    patientData: UpdatePatientDTO
  ): Promise<Patient> {
    try {
      const response = await apiClient.patch<Patient>(
        `/patients/${id}`,
        patientData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deletePatient(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/patients/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default patientService;
