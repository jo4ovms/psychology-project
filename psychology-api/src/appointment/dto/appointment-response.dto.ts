import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../entities/appointment.entity';
import { PatientResponseDto } from '../../patient/dto/patient-response.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class AppointmentResponseDto {
  @ApiProperty({
    description: 'ID do agendamento',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Data do agendamento',
    example: '2025-05-20',
  })
  appointmentDate: string;

  @ApiProperty({
    description: 'Horário do agendamento',
    example: '14:30',
  })
  appointmentTime: string;

  @ApiProperty({
    description: 'Observações do agendamento',
    example: 'Paciente solicitou confirmação por WhatsApp no dia anterior',
    required: false,
  })
  observations?: string;

  @ApiProperty({
    enum: AppointmentStatus,
    description: 'Status do agendamento',
    example: AppointmentStatus.AGENDADO,
  })
  status: AppointmentStatus;

  @ApiProperty({
    description: 'ID do paciente',
    example: 1,
  })
  patientId: number;

  @ApiProperty({
    description: 'Dados do paciente',
    type: PatientResponseDto,
  })
  patient: PatientResponseDto;

  @ApiProperty({
    description: 'Usuário que criou o agendamento',
    type: UserResponseDto,
  })
  createdBy: UserResponseDto;

  @ApiProperty({
    description: 'Data de criação do agendamento',
    example: '2025-05-15T14:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do agendamento',
    example: '2025-05-15T14:30:00.000Z',
  })
  updatedAt: Date;
}
