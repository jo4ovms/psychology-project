import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Appointment, AppointmentStatus } from "../types/models";
import {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  UpdateAppointmentStatusDTO,
} from "../types/dtos";
import appointmentService from "../services/appointmentService";

interface AppointmentFilters {
  date?: string;
  status?: AppointmentStatus;
  patientId?: number;
}

interface AppointmentState {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  selectedAppointment: Appointment | null;
  filters: AppointmentFilters;
  availableTimes: string[];
  isLoading: boolean;
  error: string | null;

  fetchAppointments: () => Promise<void>;
  fetchAppointmentById: (id: number) => Promise<void>;
  fetchAppointmentsByPatient: (patientId: number) => Promise<void>;
  fetchAppointmentsByDate: (date: string) => Promise<void>;
  fetchAvailableTimes: (date: string) => Promise<void>;
  patientAppointments: Appointment[];
  createAppointment: (
    appointmentData: CreateAppointmentDTO
  ) => Promise<Appointment>;
  updateAppointment: (
    id: number,
    appointmentData: UpdateAppointmentDTO
  ) => Promise<void>;
  updateAppointmentStatus: (
    id: number,
    status: AppointmentStatus
  ) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  clearError: () => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  devtools((set, get) => ({
    appointments: [],
    filteredAppointments: [],
    selectedAppointment: null,
    filters: {},
    availableTimes: [],
    isLoading: false,
    error: null,

    fetchAppointments: async () => {
      set({ isLoading: true, error: null });
      try {
        const appointments = await appointmentService.getAllAppointments();
        set({
          appointments,
          filteredAppointments: appointments,
          isLoading: false,
        });
        get().applyFilters();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao buscar agendamentos";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchAppointmentById: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        const appointment = await appointmentService.getAppointmentById(id);
        set({ selectedAppointment: appointment, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao buscar agendamento";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchAppointmentsByPatient: async (patientId: number) => {
      set({ isLoading: true, error: null });
      try {
        const appointments = await appointmentService.getAppointmentsByPatient(
          patientId
        );
        set({
          appointments,
          filteredAppointments: appointments,
          patientAppointments: appointments,
          isLoading: false,
          filters: { ...get().filters, patientId },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao buscar agendamentos do paciente";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchAppointmentsByDate: async (date: string) => {
      set({ isLoading: true, error: null });
      try {
        console.log("Chamando API para buscar agendamentos da data:", date);
        const appointments = await appointmentService.getAppointmentsByDate(
          date
        );
        console.log("Resposta da API:", appointments);

        set({
          appointments,
          filteredAppointments: appointments,
          patientAppointments: appointments,
          isLoading: false,
          filters: { ...get().filters, date },
        });
      } catch (error) {
        console.error("Erro ao buscar agendamentos por data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao buscar agendamentos por data";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchAvailableTimes: async (date: string) => {
      set({ isLoading: true, error: null });
      try {
        const availableTimes = await appointmentService.getAvailableTimes(date);
        set({ availableTimes, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao buscar horários disponíveis";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    createAppointment: async (appointmentData: CreateAppointmentDTO) => {
      set({ isLoading: true, error: null });
      try {
        const newAppointment = await appointmentService.createAppointment(
          appointmentData
        );

        set((state) => ({
          appointments: [...state.appointments, newAppointment],
          selectedAppointment: newAppointment,
          isLoading: false,
        }));
        get().applyFilters();
        return newAppointment;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao criar agendamento";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    updateAppointment: async (
      id: number,
      appointmentData: UpdateAppointmentDTO
    ) => {
      set({ isLoading: true, error: null });
      try {
        const updatedAppointment = await appointmentService.updateAppointment(
          id,
          appointmentData
        );

        set({ selectedAppointment: updatedAppointment });

        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id ? updatedAppointment : appointment
          ),
          isLoading: false,
        }));
        get().applyFilters();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao atualizar agendamento";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    updateAppointmentStatus: async (id: number, status: AppointmentStatus) => {
      set({ isLoading: true, error: null });
      try {
        const statusData: UpdateAppointmentStatusDTO = { status };
        const updatedAppointment =
          await appointmentService.updateAppointmentStatus(id, statusData);

        set({ selectedAppointment: updatedAppointment });

        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id ? updatedAppointment : appointment
          ),
          isLoading: false,
        }));
        get().applyFilters();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao atualizar status do agendamento";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    deleteAppointment: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        await appointmentService.deleteAppointment(id);

        if (get().selectedAppointment?.id === id) {
          set({ selectedAppointment: null });
        }

        set((state) => ({
          appointments: state.appointments.filter(
            (appointment) => appointment.id !== id
          ),
          isLoading: false,
        }));
        get().applyFilters();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao excluir agendamento";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    setSelectedAppointment: (appointment: Appointment | null) => {
      set({ selectedAppointment: appointment });
    },

    setFilters: (filters: Partial<AppointmentFilters>) => {
      set((state) => ({
        filters: { ...state.filters, ...filters },
      }));
      get().applyFilters();
    },

    clearFilters: () => {
      set({
        filters: {},
        filteredAppointments: get().appointments,
      });
    },

    applyFilters: () => {
      const { appointments, filters } = get();
      let filtered = [...appointments];

      if (filters.date) {
        filtered = filtered.filter(
          (appointment) => appointment.appointmentDate === filters.date
        );
      }

      if (filters.status) {
        filtered = filtered.filter(
          (appointment) => appointment.status === filters.status
        );
      }

      if (filters.patientId) {
        filtered = filtered.filter(
          (appointment) => appointment.patientId === filters.patientId
        );
      }

      set({ filteredAppointments: filtered });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

export default useAppointmentStore;
