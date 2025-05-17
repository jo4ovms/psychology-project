import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    enum: AppointmentStatus,
    description: 'Status do agendamento',
    example: AppointmentStatus.CANCELADO,
  })
  @IsEnum(AppointmentStatus, { message: 'Status inválido para o agendamento' })
  status: AppointmentStatus;
}
