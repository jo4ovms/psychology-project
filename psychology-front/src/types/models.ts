export enum UserRole {
  ADMIN = "ADMIN",
  PROFISSIONAL_SAUDE = "PROFISSIONAL_SAUDE",
  SECRETARIA = "SECRETARIA",
}

export enum AppointmentStatus {
  AGENDADO = "AGENDADO",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDO = "CONCLUIDO",
  CANCELADO = "CANCELADO",
}

export enum ConsultationStatus {
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDO = "CONCLUIDO",
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  id: number;
  cpf: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  homeZipCode: string;
  homeStreet: string;
  homeNumber: string;
  homeNeighborhood: string;
  homeState: string;
  homeCity: string;
  workZipCode?: string;
  workStreet?: string;
  workNumber?: string;
  workNeighborhood?: string;
  workState?: string;
  workCity?: string;
  useSameAddress: boolean;
  phone: string;
  whatsapp?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patient?: Patient;
  appointmentDate: string;
  appointmentTime: string;
  observations?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: number;
  appointmentId: number;
  appointment?: Appointment;
  notes: string;
  diagnosis?: string;
  treatmentPlan?: string;
  attentionPoints?: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface State {
  id: number;
  name: string;
  abbreviation: string;
}

export interface City {
  id: number;
  name: string;
  stateId: number;
}

export interface ConsultationHistory {
  id: number;
  patientId: number;
  patientName: string;
  consultationDate: string;
  diagnosis?: string;
  notes: string;
  attentionPoints?: string;
}
