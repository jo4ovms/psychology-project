import { ApiProperty } from '@nestjs/swagger';
import { ConsultationStatus } from '../entities/consultation.entity';
import { AppointmentResponseDto } from '../../appointment/dto/appointment-response.dto';

export class ConsultationResponseDto {
  @ApiProperty({
    description: 'ID da consulta',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do agendamento associado',
    example: 1,
  })
  appointmentId: number;

  @ApiProperty({
    description: 'Dados do agendamento associado',
    type: AppointmentResponseDto,
  })
  appointment: AppointmentResponseDto;

  @ApiProperty({
    description: 'Anotações da consulta (descriptografadas)',
    example: 'Paciente relatou melhora no quadro de ansiedade após início da terapia.',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Diagnóstico (descriptografado)',
    example: 'Transtorno de Ansiedade Generalizada (TAG)',
    required: false,
  })
  diagnosis?: string;

  @ApiProperty({
    description: 'Plano de tratamento (descriptografado)',
    example: 'Terapia Cognitivo-Comportamental semanal com foco em técnicas de relaxamento',
    required: false,
  })
  treatmentPlan?: string;

  @ApiProperty({
    description: 'Pontos de atenção do paciente (descriptografados)',
    example: 'Histórico familiar de depressão. Apresenta dificuldade para dormir.',
    required: false,
  })
  attentionPoints?: string;

  @ApiProperty({
    description: 'Status da consulta',
    enum: ConsultationStatus,
    example: ConsultationStatus.EM_ANDAMENTO,
  })
  status: ConsultationStatus;

  @ApiProperty({
    description: 'ID do profissional responsável pela consulta',
    example: 1,
  })
  professionalId: number;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-05-17T14:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2025-05-17T14:30:00.000Z',
  })
  updatedAt: Date;
}
