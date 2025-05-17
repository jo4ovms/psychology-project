import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsString, IsOptional, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID do paciente',
    example: 1,
  })
  @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
  patientId: number;

  @ApiProperty({
    description: 'Data do agendamento (YYYY-MM-DD)',
    example: '2025-05-20',
  })
  @IsNotEmpty({ message: 'A data do agendamento é obrigatória' })
  @IsDateString({}, { message: 'Formato de data inválido. Use YYYY-MM-DD' })
  appointmentDate: string;

  @ApiProperty({
    description: 'Horário do agendamento (HH:MM)',
    example: '14:30',
  })
  @IsNotEmpty({ message: 'O horário do agendamento é obrigatório' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Formato de horário inválido. Use HH:MM (exemplo: 14:30)',
  })
  appointmentTime: string;

  @ApiProperty({
    description: 'Observações do agendamento',
    example: 'Paciente solicitou confirmação por WhatsApp no dia anterior',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'As observações devem estar em formato de texto' })
  observations?: string;
}
