import { AppointmentStatus, ConsultationStatus, UserRole } from "./models";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export interface CreatePatientDTO {
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
}

export interface UpdatePatientDTO {
  firstName?: string;
  lastName?: string;
  homeZipCode?: string;
  homeStreet?: string;
  homeNumber?: string;
  homeNeighborhood?: string;
  homeState?: string;
  homeCity?: string;
  workZipCode?: string;
  workStreet?: string;
  workNumber?: string;
  workNeighborhood?: string;
  workState?: string;
  workCity?: string;
  useSameAddress?: boolean;
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export interface CreateAppointmentDTO {
  patientId: number;
  appointmentDate: string;
  appointmentTime: string;
  observations?: string;
}

export interface UpdateAppointmentDTO {
  appointmentDate?: string;
  appointmentTime?: string;
  observations?: string;
}

export interface UpdateAppointmentStatusDTO {
  status: AppointmentStatus;
}

export interface CreateConsultationDTO {
  appointmentId: number;
  notes: string;
  diagnosis?: string;
  treatmentPlan?: string;
  attentionPoints?: string;
  status?: ConsultationStatus;
}

export interface UpdateConsultationDTO {
  notes?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  attentionPoints?: string;
}
