import * as Yup from "yup";
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

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required(errorMessages.required)
    .email(errorMessages.email),
  password: Yup.string()
    .required(errorMessages.required)
    .min(8, errorMessages.password),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required(errorMessages.required)
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: Yup.string()
    .required(errorMessages.required)
    .email(errorMessages.email),
  password: Yup.string()
    .required(errorMessages.required)
    .min(8, errorMessages.password),
  role: Yup.string()
    .required("Selecione um perfil")
    .oneOf(
      [UserRole.ADMIN, UserRole.PROFISSIONAL_SAUDE, UserRole.SECRETARIA],
      "Selecione um perfil válido"
    ),
});

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required(errorMessages.required)
    .min(8, errorMessages.password),
  newPassword: Yup.string()
    .required(errorMessages.required)
    .min(8, errorMessages.password),
  confirmPassword: Yup.string()
    .required(errorMessages.required)
    .min(8, errorMessages.password)
    .oneOf([Yup.ref("newPassword")], "As senhas não conferem"),
});

export const patientSchema = Yup.object().shape({
  cpf: Yup.string()
    .required(errorMessages.required)
    .matches(patterns.cpf, errorMessages.cpf),
  firstName: Yup.string()
    .required(errorMessages.required)
    .min(2, "Nome deve ter no mínimo 2 caracteres"),
  lastName: Yup.string()
    .required(errorMessages.required)
    .min(2, "Sobrenome deve ter no mínimo 2 caracteres"),
  birthDate: Yup.string()
    .required(errorMessages.required)
    .matches(/^\d{4}-\d{2}-\d{2}$/, errorMessages.date),
  homeZipCode: Yup.string()
    .required(errorMessages.required)
    .min(5, "CEP inválido"),
  homeStreet: Yup.string().required(errorMessages.required),
  homeNumber: Yup.string().required(errorMessages.required),
  homeNeighborhood: Yup.string().required(errorMessages.required),
  homeState: Yup.string().required(errorMessages.required),
  homeCity: Yup.string().required(errorMessages.required),
  useSameAddress: Yup.boolean().default(true),
  workZipCode: Yup.string().optional(),
  workStreet: Yup.string().optional(),
  workNumber: Yup.string().optional(),
  workNeighborhood: Yup.string().optional(),
  workState: Yup.string().optional(),
  workCity: Yup.string().optional(),
  phone: Yup.string()
    .required(errorMessages.required)
    .matches(patterns.phone, errorMessages.phone),
  whatsapp: Yup.string()
    .optional()
    .nullable()
    .matches(patterns.phone, errorMessages.phone)
    .transform((value) => (value === "" ? null : value)),
  email: Yup.string()
    .optional()
    .nullable()
    .email(errorMessages.email)
    .transform((value) => (value === "" ? null : value)),
});

export const appointmentSchema = Yup.object().shape({
  patientId: Yup.number().required(errorMessages.required),
  appointmentDate: Yup.string()
    .required(errorMessages.required)
    .matches(/^\d{4}-\d{2}-\d{2}$/, errorMessages.date),
  appointmentTime: Yup.string()
    .required(errorMessages.required)
    .matches(/^\d{2}:\d{2}$/, errorMessages.time),
  observations: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export const consultationSchema = Yup.object().shape({
  appointmentId: Yup.number().required(errorMessages.required),
  notes: Yup.string()
    .required(errorMessages.required)
    .min(1, "As anotações são obrigatórias"),
  diagnosis: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  treatmentPlan: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  attentionPoints: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});
