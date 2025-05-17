import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiProperty({
    enum: AppointmentStatus,
    description: 'Status do agendamento',
    example: AppointmentStatus.EM_ANDAMENTO,
    required: false,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Status inválido para o agendamento' })
  status?: AppointmentStatus;
}
