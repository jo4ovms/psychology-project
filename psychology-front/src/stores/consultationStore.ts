import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Consultation, ConsultationHistory } from "../types/models";
import { CreateConsultationDTO, UpdateConsultationDTO } from "../types/dtos";
import consultationService from "../services/consultationService";

interface ConsultationState {
  consultations: Consultation[];
  selectedConsultation: Consultation | null;
  patientConsultations: Consultation[];
  patientHistory: ConsultationHistory[];
  isLoading: boolean;
  error: string | null;

  fetchConsultations: () => Promise<void>;
  fetchConsultationById: (id: number) => Promise<void>;
  fetchConsultationsByPatient: (patientId: number) => Promise<void>;
  fetchConsultationHistoryByPatient: (patientId: number) => Promise<void>;
  createConsultation: (
    consultationData: CreateConsultationDTO
  ) => Promise<Consultation>;
  updateConsultation: (
    id: number,
    consultationData: UpdateConsultationDTO
  ) => Promise<void>;
  concludeConsultation: (id: number) => Promise<void>;
  deleteConsultation: (id: number) => Promise<void>;
  setSelectedConsultation: (consultation: Consultation | null) => void;
  clearError: () => void;
}

export const useConsultationStore = create<ConsultationState>()(
  devtools((set, get) => ({
    consultations: [],
    selectedConsultation: null,
    patientConsultations: [],
    patientHistory: [],
    isLoading: false,
    error: null,

    fetchConsultations: async () => {
      set({ isLoading: true, error: null });
      try {
        const consultations = await consultationService.getAllConsultations();
        set({ consultations, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao buscar consultas";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchConsultationById: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        const consultation = await consultationService.getConsultationById(id);
        set({ selectedConsultation: consultation, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao buscar consulta";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchConsultationsByPatient: async (patientId: number) => {
      set({ isLoading: true, error: null });
      try {
        const patientConsultations =
          await consultationService.getConsultationsByPatient(patientId);
        set({ patientConsultations, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao buscar consultas do paciente";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchConsultationHistoryByPatient: async (patientId: number) => {
      set({ isLoading: true, error: null });
      try {
        const patientHistory =
          await consultationService.getConsultationHistoryByPatient(patientId);
        set({ patientHistory, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao buscar histórico de consultas";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    createConsultation: async (consultationData: CreateConsultationDTO) => {
      set({ isLoading: true, error: null });
      try {
        const newConsultation = await consultationService.createConsultation(
          consultationData
        );

        set((state) => ({
          consultations: [...state.consultations, newConsultation],
          selectedConsultation: newConsultation,
          isLoading: false,
        }));

        if (
          get().patientConsultations.length > 0 &&
          get().patientConsultations[0].appointment?.patientId ===
            newConsultation.appointment?.patientId
        ) {
          set((state) => ({
            patientConsultations: [
              ...state.patientConsultations,
              newConsultation,
            ],
          }));
        }

        return newConsultation;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao criar consulta";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    updateConsultation: async (
      id: number,
      consultationData: UpdateConsultationDTO
    ) => {
      set({ isLoading: true, error: null });
      try {
        const updatedConsultation =
          await consultationService.updateConsultation(id, consultationData);

        set({ selectedConsultation: updatedConsultation });

        const updateConsultationInList = (list: Consultation[]) =>
          list.map((consultation) =>
            consultation.id === id ? updatedConsultation : consultation
          );

        set((state) => ({
          consultations: updateConsultationInList(state.consultations),
          patientConsultations: updateConsultationInList(
            state.patientConsultations
          ),
          isLoading: false,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao atualizar consulta";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    concludeConsultation: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        const concludedConsultation =
          await consultationService.concludeConsultation(id);

        set({ selectedConsultation: concludedConsultation });

        const updateConsultationInList = (list: Consultation[]) =>
          list.map((consultation) =>
            consultation.id === id ? concludedConsultation : consultation
          );

        set((state) => ({
          consultations: updateConsultationInList(state.consultations),
          patientConsultations: updateConsultationInList(
            state.patientConsultations
          ),
          isLoading: false,
        }));

        if (
          concludedConsultation.appointment?.patientId &&
          get().patientHistory.length > 0
        ) {
          await get().fetchConsultationHistoryByPatient(
            concludedConsultation.appointment.patientId
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao concluir consulta";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    deleteConsultation: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        await consultationService.deleteConsultation(id);

        if (get().selectedConsultation?.id === id) {
          set({ selectedConsultation: null });
        }

        set((state) => ({
          consultations: state.consultations.filter(
            (consultation) => consultation.id !== id
          ),
          patientConsultations: state.patientConsultations.filter(
            (consultation) => consultation.id !== id
          ),
          isLoading: false,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao excluir consulta";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    setSelectedConsultation: (consultation: Consultation | null) => {
      set({ selectedConsultation: consultation });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

export default useConsultationStore;
