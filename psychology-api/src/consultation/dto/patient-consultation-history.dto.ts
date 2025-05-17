import { ApiProperty } from '@nestjs/swagger';
import { ConsultationResponseDto } from './consultation-response.dto';

export class ConsultationHistoryItemDto {
  @ApiProperty({
    description: 'Data da consulta (formatada)',
    example: '17/05/2025',
  })
  formattedDate: string;

  @ApiProperty({
    description: 'Dados completos da consulta',
    type: ConsultationResponseDto,
  })
  consultation: ConsultationResponseDto;
}

export class PatientConsultationHistoryDto {
  @ApiProperty({
    description: 'ID do paciente',
    example: 1,
  })
  patientId: number;

  @ApiProperty({
    description: 'Nome do paciente',
    example: 'João Silva',
  })
  patientName: string;

  @ApiProperty({
    description: 'Histórico de consultas ordenado cronologicamente',
    type: [ConsultationHistoryItemDto],
  })
  consultationHistory: ConsultationHistoryItemDto[];
}
