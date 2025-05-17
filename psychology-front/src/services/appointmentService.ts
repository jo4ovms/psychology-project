import { apiClient } from "./api/apiClient";
import {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  UpdateAppointmentStatusDTO,
} from "../types/dtos";
import { ApiResponse, Appointment } from "../types/models";

export const appointmentService = {
  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<Appointment[]>("/appointments");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAppointmentById(id: number): Promise<Appointment> {
    try {
      const response = await apiClient.get<Appointment>(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<Appointment[]>(
        `/appointments/patient/${patientId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<Appointment[]>(
        `/appointments/date/${date}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAvailableTimes(date: string): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        `/appointments/available-times?date=${date}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createAppointment(
    appointmentData: CreateAppointmentDTO
  ): Promise<Appointment> {
    try {
      const response = await apiClient.post<Appointment>(
        "/appointments",
        appointmentData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateAppointment(
    id: number,
    appointmentData: UpdateAppointmentDTO
  ): Promise<Appointment> {
    try {
      const response = await apiClient.patch<Appointment>(
        `/appointments/${id}`,
        appointmentData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateAppointmentStatus(
    id: number,
    statusData: UpdateAppointmentStatusDTO
  ): Promise<Appointment> {
    try {
      const response = await apiClient.patch<Appointment>(
        `/appointments/${id}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteAppointment(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/appointments/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default appointmentService;
