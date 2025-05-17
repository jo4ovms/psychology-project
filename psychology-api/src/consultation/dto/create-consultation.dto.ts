import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ConsultationStatus } from '../entities/consultation.entity';

export class CreateConsultationDto {
  @ApiProperty({
    description: 'ID do agendamento associado à consulta',
    example: 1,
  })
  @IsInt({ message: 'O ID do agendamento deve ser um número inteiro' })
  appointmentId: number;

  @ApiProperty({
    description: 'Anotações da consulta (serão criptografadas)',
    example: 'Paciente relatou melhora no quadro de ansiedade após início da terapia.',
    required: false,
  })
  @IsString({ message: 'As anotações devem ser um texto' })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Diagnóstico (será criptografado)',
    example: 'Transtorno de Ansiedade Generalizada (TAG)',
    required: false,
  })
  @IsString({ message: 'O diagnóstico deve ser um texto' })
  @IsOptional()
  diagnosis?: string;

  @ApiProperty({
    description: 'Plano de tratamento (será criptografado)',
    example: 'Terapia Cognitivo-Comportamental semanal com foco em técnicas de relaxamento',
    required: false,
  })
  @IsString({ message: 'O plano de tratamento deve ser um texto' })
  @IsOptional()
  treatmentPlan?: string;

  @ApiProperty({
    description: 'Status da consulta',
    enum: ConsultationStatus,
    example: ConsultationStatus.EM_ANDAMENTO,
    default: ConsultationStatus.EM_ANDAMENTO,
    required: false,
  })
  @IsEnum(ConsultationStatus, { message: 'Status inválido para consulta' })
  @IsOptional()
  status?: ConsultationStatus;
}
