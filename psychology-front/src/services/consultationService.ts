import { apiClient } from "./api/apiClient";
import { CreateConsultationDTO, UpdateConsultationDTO } from "../types/dtos";
import {
  ApiResponse,
  Consultation,
  ConsultationHistory,
} from "../types/models";

export const consultationService = {
  async getAllConsultations(): Promise<Consultation[]> {
    try {
      const response = await apiClient.get<Consultation[]>("/consultations");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getConsultationById(id: number): Promise<Consultation> {
    try {
      const response = await apiClient.get<Consultation>(
        `/consultations/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getConsultationsByPatient(patientId: number): Promise<Consultation[]> {
    try {
      const response = await apiClient.get<Consultation[]>(
        `/consultations/patient/${patientId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getConsultationHistoryByPatient(
    patientId: number
  ): Promise<ConsultationHistory[]> {
    try {
      const response = await apiClient.get<ConsultationHistory[]>(
        `/consultations/patient/${patientId}/history`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createConsultation(
    consultationData: CreateConsultationDTO
  ): Promise<Consultation> {
    try {
      const response = await apiClient.post<Consultation>(
        "/consultations",
        consultationData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateConsultation(
    id: number,
    consultationData: UpdateConsultationDTO
  ): Promise<Consultation> {
    try {
      const response = await apiClient.patch<Consultation>(
        `/consultations/${id}`,
        consultationData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async concludeConsultation(id: number): Promise<Consultation> {
    try {
      const response = await apiClient.patch<Consultation>(
        `/consultations/${id}/conclude`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteConsultation(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/consultations/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default consultationService;
