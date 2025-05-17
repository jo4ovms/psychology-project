import { z } from "zod";
import { UserRole } from "../types/models";

const patterns = {
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  phone: /^\(\d{2}\) \d{5}-\d{4}$/,
  zipCode: /^\d{5}-\d{3}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

const errorMessages = {
  required: "Campo obrigatório",
  cpf: "CPF inválido. Formato esperado: 000.000.000-00",
  phone: "Telefone inválido. Formato esperado: (00) 00000-0000",
  zipCode: "CEP inválido. Formato esperado: 00000-000",
  email: "Email inválido",
  password: "A senha deve ter no mínimo 8 caracteres",
  date: "Data inválida. Formato esperado: AAAA-MM-DD",
  time: "Horário inválido. Formato esperado: HH:MM",
};

export const loginSchema = z.object({
  email: z
    .string({ required_error: errorMessages.required })
    .email(errorMessages.email),
  password: z
    .string({ required_error: errorMessages.required })
    .min(8, errorMessages.password),
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: errorMessages.required })
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z
    .string({ required_error: errorMessages.required })
    .email(errorMessages.email),
  password: z
    .string({ required_error: errorMessages.required })
    .min(8, errorMessages.password),
  role: z.enum(
    [UserRole.ADMIN, UserRole.PROFISSIONAL_SAUDE, UserRole.SECRETARIA],
    {
      required_error: "Selecione um perfil",
    }
  ),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ required_error: errorMessages.required })
      .min(8, errorMessages.password),
    newPassword: z
      .string({ required_error: errorMessages.required })
      .min(8, errorMessages.password),
    confirmPassword: z
      .string({ required_error: errorMessages.required })
      .min(8, errorMessages.password),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export const patientSchema = z.object({
  cpf: z
    .string({ required_error: errorMessages.required })
    .regex(patterns.cpf, errorMessages.cpf),
  firstName: z
    .string({ required_error: errorMessages.required })
    .min(2, "Nome deve ter no mínimo 2 caracteres"),
  lastName: z
    .string({ required_error: errorMessages.required })
    .min(2, "Sobrenome deve ter no mínimo 2 caracteres"),
  birthDate: z
    .string({ required_error: errorMessages.required })
    .regex(/^\d{4}-\d{2}-\d{2}$/, errorMessages.date),
  homeZipCode: z
    .string({ required_error: errorMessages.required })
    .min(8, "CEP inválido"),
  homeStreet: z.string({ required_error: errorMessages.required }),
  homeNumber: z.string({ required_error: errorMessages.required }),
  homeNeighborhood: z.string({ required_error: errorMessages.required }),
  homeState: z.string({ required_error: errorMessages.required }),
  homeCity: z.string({ required_error: errorMessages.required }),
  useSameAddress: z.boolean().default(true),
  workZipCode: z.string().optional(),
  workStreet: z.string().optional(),
  workNumber: z.string().optional(),
  workNeighborhood: z.string().optional(),
  workState: z.string().optional(),
  workCity: z.string().optional(),
  phone: z
    .string({ required_error: errorMessages.required })
    .regex(patterns.phone, errorMessages.phone),
  whatsapp: z
    .string()
    .regex(patterns.phone, errorMessages.phone)
    .optional()
    .or(z.literal("")),
  email: z.string().email(errorMessages.email).optional().or(z.literal("")),
});

export const appointmentSchema = z.object({
  patientId: z.number({ required_error: errorMessages.required }),
  appointmentDate: z
    .string({ required_error: errorMessages.required })
    .regex(/^\d{4}-\d{2}-\d{2}$/, errorMessages.date),
  appointmentTime: z
    .string({ required_error: errorMessages.required })
    .regex(/^\d{2}:\d{2}$/, errorMessages.time),
  observations: z.string().optional().or(z.literal("")),
});

export const consultationSchema = z.object({
  appointmentId: z.number({ required_error: errorMessages.required }),
  notes: z
    .string({ required_error: errorMessages.required })
    .min(1, "As anotações são obrigatórias"),
  diagnosis: z.string().optional().or(z.literal("")),
  treatmentPlan: z.string().optional().or(z.literal("")),
  attentionPoints: z.string().optional().or(z.literal("")),
});
