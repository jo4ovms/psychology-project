import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Patient } from "../types/models";
import { CreatePatientDTO, UpdatePatientDTO } from "../types/dtos";
import patientService from "../services/patientService";

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;

  fetchPatients: () => Promise<void>;
  fetchPatientById: (id: number) => Promise<void>;
  fetchPatientByCpf: (cpf: string) => Promise<void>;
  createPatient: (patientData: CreatePatientDTO) => Promise<Patient>;
  updatePatient: (id: number, patientData: UpdatePatientDTO) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  setSelectedPatient: (patient: Patient | null) => void;
  clearError: () => void;
}

export const usePatientStore = create<PatientState>()(
  devtools((set, get) => ({
    patients: [],
    selectedPatient: null,
    isLoading: false,
    error: null,

    fetchPatients: async () => {
      set({ isLoading: true, error: null });
      try {
        const patients = await patientService.getAllPatients();
        set({ patients, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao buscar pacientes";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchPatientById: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        const patient = await patientService.getPatientById(id);
        set({ selectedPatient: patient, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao buscar paciente";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchPatientByCpf: async (cpf: string) => {
      set({ isLoading: true, error: null });
      try {
        const patient = await patientService.getPatientByCpf(cpf);
        set({ selectedPatient: patient, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao buscar paciente por CPF";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    createPatient: async (patientData: CreatePatientDTO) => {
      set({ isLoading: true, error: null });
      try {
        const newPatient = await patientService.createPatient(patientData);

        set((state) => ({
          patients: [...state.patients, newPatient],
          selectedPatient: newPatient,
          isLoading: false,
        }));
        return newPatient;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao criar paciente";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    updatePatient: async (id: number, patientData: UpdatePatientDTO) => {
      set({ isLoading: true, error: null });
      try {
        const updatedPatient = await patientService.updatePatient(
          id,
          patientData
        );

        set({ selectedPatient: updatedPatient });

        set((state) => ({
          patients: state.patients.map((patient) =>
            patient.id === id ? updatedPatient : patient
          ),
          isLoading: false,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Falha ao atualizar paciente";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    deletePatient: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        await patientService.deletePatient(id);

        if (get().selectedPatient?.id === id) {
          set({ selectedPatient: null });
        }

        set((state) => ({
          patients: state.patients.filter((patient) => patient.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Falha ao excluir paciente";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    setSelectedPatient: (patient: Patient | null) => {
      set({ selectedPatient: patient });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

export default usePatientStore;
