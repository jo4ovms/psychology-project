import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { PatientService } from '../patient/patient.service';
import { format, parse, isValid, isBefore, startOfDay } from 'date-fns';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private patientService: PatientService,
    private userService: UserService,
  ) {}

  /**
   * Verifica se o horário está dentro do intervalo permitido (8:00-17:00)
   * @param time - Horário a ser verificado (formato HH:MM)
   * @returns boolean - Verdadeiro se o horário for válido
   */
  private isValidTime(time: string): boolean {
    const [hours, minutes] = time.split(':').map(Number);

    if (hours < 8 || hours > 17) {
      return false;
    }

    if (hours === 17 && minutes > 0) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se existe um agendamento conflitante para a data/hora
   * @param date - Data do agendamento
   * @param time - Horário do agendamento
   * @param excludeId - ID do agendamento a ser excluído da verificação (para updates)
   * @returns boolean - Verdadeiro se houver conflito
   */
  private async hasTimeConflict(date: string, time: string, excludeId?: number): Promise<boolean> {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.appointmentDate = :date', { date })
      .andWhere('appointment.appointmentTime = :time', { time })
      .andWhere('appointment.status != :canceledStatus', {
        canceledStatus: AppointmentStatus.CANCELADO,
      });

    if (excludeId) {
      query.andWhere('appointment.id != :id', { id: excludeId });
    }

    const conflictCount = await query.getCount();
    return conflictCount > 0;
  }

  /**
   * Obtém horários disponíveis para uma determinada data
   * @param date - Data para verificar horários disponíveis
   * @returns string[] - Lista de horários disponíveis
   */
  async getAvailableTimeSlots(date: string): Promise<string[]> {
    const allTimeSlots = [];
    for (let hour = 8; hour <= 17; hour++) {
      if (hour < 17) {
        for (let minute = 0; minute < 60; minute += 30) {
          allTimeSlots.push(
            `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          );
        }
      } else {
        allTimeSlots.push('17:00');
      }
    }

    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());

    const existingAppointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: parsedDate,
        status: AppointmentStatus.AGENDADO || AppointmentStatus.EM_ANDAMENTO,
      },
      select: ['appointmentTime'],
    });

    const occupiedTimeSlots = existingAppointments.map(app => app.appointmentTime);

    return allTimeSlots.filter(time => !occupiedTimeSlots.includes(time));
  }

  /**
   * Cria um novo agendamento
   * @param createAppointmentDto - Dados para criação do agendamento
   * @param userId - ID do usuário que está criando o agendamento
   * @returns AppointmentResponseDto - Dados do agendamento criado
   */
  async create(
    createAppointmentDto: CreateAppointmentDto,
    userId: number,
  ): Promise<AppointmentResponseDto> {
    await this.patientService.findOne(createAppointmentDto.patientId);

    const appointmentDate = parse(createAppointmentDto.appointmentDate, 'yyyy-MM-dd', new Date());
    if (!isValid(appointmentDate)) {
      throw new BadRequestException('Data de agendamento inválida');
    }

    if (isBefore(appointmentDate, startOfDay(new Date()))) {
      throw new BadRequestException('Não é possível agendar para datas passadas');
    }

    if (!this.isValidTime(createAppointmentDto.appointmentTime)) {
      throw new BadRequestException('Horário deve estar entre 8:00 e 17:00');
    }

    const hasConflict = await this.hasTimeConflict(
      createAppointmentDto.appointmentDate,
      createAppointmentDto.appointmentTime,
    );

    if (hasConflict) {
      throw new ConflictException('Já existe um agendamento para esta data e horário');
    }

    const newAppointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentDate: appointmentDate,
      status: AppointmentStatus.AGENDADO,
      createdById: userId,
    });

    const savedAppointment = await this.appointmentRepository.save(newAppointment);
    return this.mapToResponseDto(savedAppointment);
  }

  /**
   * Lista todos os agendamentos
   * @returns Array de AppointmentResponseDto - Lista de agendamentos
   */
  async findAll(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentRepository.find({
      order: {
        appointmentDate: 'ASC',
        appointmentTime: 'ASC',
      },
      relations: ['patient', 'createdBy'],
    });

    return appointments.map(appointment => this.mapToResponseDto(appointment));
  }

  /**
   * Busca todos os agendamentos para uma data específica
   * @param date - Data para filtrar agendamentos
   * @returns Array de AppointmentResponseDto - Lista de agendamentos da data
   */
  async findByDate(date: string): Promise<AppointmentResponseDto[]> {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate)) {
      throw new BadRequestException('Data inválida. Use o formato YYYY-MM-DD');
    }

    const appointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: parsedDate,
      },
      order: {
        appointmentTime: 'ASC',
      },
      relations: ['patient', 'createdBy'],
    });

    return appointments.map(appointment => this.mapToResponseDto(appointment));
  }

  /**
   * Busca todos os agendamentos de um paciente
   * @param patientId - ID do paciente
   * @returns Array de AppointmentResponseDto - Lista de agendamentos do paciente
   */
  async findByPatient(patientId: number): Promise<AppointmentResponseDto[]> {
    await this.patientService.findOne(patientId);

    const appointments = await this.appointmentRepository.find({
      where: {
        patientId,
      },
      order: {
        appointmentDate: 'DESC',
        appointmentTime: 'DESC',
      },
      relations: ['patient', 'createdBy'],
    });

    return appointments.map(appointment => this.mapToResponseDto(appointment));
  }

  /**
   * Busca um agendamento pelo ID
   * @param id - ID do agendamento
   * @returns AppointmentResponseDto - Dados do agendamento
   * @throws NotFoundException - Quando o agendamento não é encontrado
   */
  async findOne(id: number): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'createdBy'],
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    return this.mapToResponseDto(appointment);
  }

  /**
   * Atualiza um agendamento
   * @param id - ID do agendamento
   * @param updateAppointmentDto - Dados para atualização
   * @returns AppointmentResponseDto - Dados atualizados do agendamento
   * @throws NotFoundException - Quando o agendamento não é encontrado
   */

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'createdBy'],
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    if (appointment.status === AppointmentStatus.CONCLUIDO) {
      throw new BadRequestException('Não é possível alterar agendamentos já concluídos');
    }

    if (updateAppointmentDto.patientId) {
      await this.patientService.findOne(updateAppointmentDto.patientId);
    }

    const { appointmentDate: dateFromDto, ...restOfUpdateDto } = updateAppointmentDto;
    const dataToUpdate: any = { ...restOfUpdateDto };

    if (dateFromDto || updateAppointmentDto.appointmentTime) {
      const dateToCheck = dateFromDto
        ? typeof dateFromDto === 'string'
          ? dateFromDto
          : format(dateFromDto, 'yyyy-MM-dd')
        : format(appointment.appointmentDate, 'yyyy-MM-dd');

      const timeToCheck = updateAppointmentDto.appointmentTime || appointment.appointmentTime;

      if (dateFromDto) {
        const dateStr =
          typeof dateFromDto === 'string' ? dateFromDto : format(dateFromDto, 'yyyy-MM-dd');
        const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());

        if (!isValid(parsedDate)) {
          throw new BadRequestException('Data de agendamento inválida');
        }

        if (isBefore(parsedDate, startOfDay(new Date()))) {
          throw new BadRequestException('Não é possível agendar para datas passadas');
        }

        dataToUpdate.appointmentDate = parsedDate;
      }

      if (
        updateAppointmentDto.appointmentTime &&
        !this.isValidTime(updateAppointmentDto.appointmentTime)
      ) {
        throw new BadRequestException('Horário deve estar entre 8:00 e 17:00');
      }

      const hasConflict =
        (await this.appointmentRepository
          .createQueryBuilder('appointment')
          .where('appointment.appointmentDate = :date', { date: dateToCheck })
          .andWhere('appointment.appointmentTime = :time', { time: timeToCheck })
          .andWhere('appointment.status != :canceledStatus', {
            canceledStatus: AppointmentStatus.CANCELADO,
          })
          .andWhere('appointment.id != :id', { id })
          .getCount()) > 0;

      if (hasConflict) {
        throw new ConflictException('Já existe um agendamento para esta data e horário');
      }
    }

    const updated = this.appointmentRepository.merge(appointment, dataToUpdate);
    const savedAppointment = await this.appointmentRepository.save(updated);

    return this.mapToResponseDto(savedAppointment);
  }
  /**
   * Atualiza o status de um agendamento
   * @param id - ID do agendamento
   * @param status - Novo status
   * @returns AppointmentResponseDto - Dados atualizados do agendamento
   */
  async updateStatus(id: number, status: AppointmentStatus): Promise<AppointmentResponseDto> {
    const appointment = await this.findOne(id);

    if (
      status === AppointmentStatus.CANCELADO &&
      appointment.status === AppointmentStatus.CONCLUIDO
    ) {
      throw new BadRequestException('Não é possível cancelar um agendamento já concluído');
    }

    if (
      status === AppointmentStatus.AGENDADO &&
      appointment.status === AppointmentStatus.CONCLUIDO
    ) {
      throw new BadRequestException(
        'Não é possível retornar ao status AGENDADO um agendamento já concluído',
      );
    }

    return this.update(id, { status });
  }

  /**
   * Remove um agendamento
   * @param id - ID do agendamento
   * @throws NotFoundException - Quando o agendamento não é encontrado
   */
  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);

    if (appointment.status === AppointmentStatus.CONCLUIDO) {
      throw new BadRequestException('Não é possível remover agendamentos já concluídos');
    }

    const result = await this.appointmentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }
  }

  /**
   * Converte entidade Appointment para DTO de resposta
   * @param appointment - Entidade Appointment
   * @returns AppointmentResponseDto - DTO de resposta
   */
  private mapToResponseDto(appointment: Appointment): AppointmentResponseDto {
    return {
      id: appointment.id,
      appointmentDate: format(appointment.appointmentDate, 'yyyy-MM-dd'),
      appointmentTime: appointment.appointmentTime,
      observations: appointment.observations,
      status: appointment.status,
      patientId: appointment.patientId,
      patient: appointment.patient,
      createdBy: this.userService.mapToResponseDto(appointment.createdBy),
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}
