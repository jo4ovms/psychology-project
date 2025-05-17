import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation, ConsultationStatus } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
import { AppointmentService } from '../appointment/appointment.service';
import { CryptographyService } from 'src/common/crypt/cryptography.service';
import { AppointmentStatus } from '../appointment/entities/appointment.entity';
import { UserType } from '../user/user-type.enum';
import { PatientConsultationHistoryDto } from './dto/patient-consultation-history.dto';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    private appointmentService: AppointmentService,
    private cryptographyService: CryptographyService,
  ) {}

  /**
   * Cria uma nova consulta a partir de um agendamento
   * @param createConsultationDto - Dados para criação da consulta
   * @param userId - ID do usuário que está criando a consulta
   * @returns ConsultationResponseDto - Dados da consulta criada
   */
  async create(
    createConsultationDto: CreateConsultationDto,
    userId: number,
  ): Promise<ConsultationResponseDto> {
    const appointment = await this.appointmentService.findOne(createConsultationDto.appointmentId);

    const existingConsultation = await this.consultationRepository.findOne({
      where: { appointmentId: appointment.id },
    });

    if (existingConsultation) {
      throw new BadRequestException('Este agendamento já possui uma consulta associada');
    }

    if (
      appointment.status !== AppointmentStatus.AGENDADO &&
      appointment.status !== AppointmentStatus.EM_ANDAMENTO
    ) {
      throw new BadRequestException(
        'Somente agendamentos com status AGENDADO ou EM_ANDAMENTO podem iniciar consulta',
      );
    }

    await this.appointmentService.updateStatus(appointment.id, AppointmentStatus.EM_ANDAMENTO);

    const { encryptedText: encryptedNotes, iv: notesIV } = createConsultationDto.notes
      ? this.cryptographyService.encrypt(createConsultationDto.notes, userId)
      : { encryptedText: null, iv: null };

    const { encryptedText: encryptedDiagnosis, iv: diagnosisIV } = createConsultationDto.diagnosis
      ? this.cryptographyService.encrypt(createConsultationDto.diagnosis, userId)
      : { encryptedText: null, iv: null };

    const { encryptedText: encryptedTreatmentPlan, iv: treatmentPlanIV } =
      createConsultationDto.treatmentPlan
        ? this.cryptographyService.encrypt(createConsultationDto.treatmentPlan, userId)
        : { encryptedText: null, iv: null };

    const { encryptedText: encryptedAttentionPoints, iv: attentionPointsIV } =
      createConsultationDto.attentionPoints
        ? this.cryptographyService.encrypt(createConsultationDto.attentionPoints, userId)
        : { encryptedText: null, iv: null };

    const newConsultation = this.consultationRepository.create({
      appointmentId: appointment.id,
      encryptedNotes,
      encryptedDiagnosis,
      encryptedTreatmentPlan,
      encryptedAttentionPoints,
      attentionPointsIV,
      status: createConsultationDto.status || ConsultationStatus.EM_ANDAMENTO,
      professionalId: userId,
      notesIV,
      diagnosisIV,
      treatmentPlanIV,
    });

    const savedConsultation = await this.consultationRepository.save(newConsultation);
    return this.mapToResponseDto(savedConsultation, userId);
  }

  /**
   * Lista todas as consultas que o usuário tem acesso
   * @param userId - ID do usuário que está solicitando
   * @param userRole - Papel do usuário
   * @returns Array de ConsultationResponseDto - Lista de consultas
   */
  async findAll(userId: number, userRole: UserType): Promise<ConsultationResponseDto[]> {
    let consultations: Consultation[];

    if (userRole === UserType.PROFISSIONAL_SAUDE) {
      consultations = await this.consultationRepository.find({
        where: { professionalId: userId },
        relations: ['appointment', 'appointment.patient', 'appointment.createdBy'],
        order: {
          createdAt: 'DESC',
        },
      });
    } else {
      consultations = await this.consultationRepository.find({
        relations: ['appointment', 'appointment.patient', 'appointment.createdBy'],
        order: {
          createdAt: 'DESC',
        },
      });
    }

    return consultations.map(consultation => this.mapToResponseDto(consultation, userId));
  }

  /**
   * Busca uma consulta específica pelo ID
   * @param id - ID da consulta
   * @param userId - ID do usuário que está solicitando
   * @param userRole - Papel do usuário
   * @returns ConsultationResponseDto - Dados da consulta
   */
  async findOne(id: number, userId: number, userRole: UserType): Promise<ConsultationResponseDto> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['appointment', 'appointment.patient', 'appointment.createdBy'],
    });

    if (!consultation) {
      throw new NotFoundException(`Consulta com ID ${id} não encontrada`);
    }

    if (userRole === UserType.PROFISSIONAL_SAUDE && consultation.professionalId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para visualizar os dados desta consulta',
      );
    }

    return this.mapToResponseDto(consultation, userId);
  }

  /**
   * Busca consultas de um paciente específico
   * @param patientId - ID do paciente
   * @param userId - ID do usuário que está solicitando
   * @param userRole - Papel do usuário
   * @returns Array de ConsultationResponseDto - Lista de consultas do paciente
   */
  async findByPatient(patientId: number, userId: number): Promise<ConsultationResponseDto[]> {
    const consultations = await this.consultationRepository
      .createQueryBuilder('consultation')
      .innerJoinAndSelect('consultation.appointment', 'appointment')
      .innerJoinAndSelect('appointment.patient', 'patient')
      .innerJoinAndSelect('appointment.createdBy', 'createdBy')
      .where('appointment.patientId = :patientId', { patientId })
      .orderBy('consultation.createdAt', 'DESC')
      .getMany();

    return consultations.map(consultation => this.mapToResponseDto(consultation, userId));
  }

  /**
   * Atualiza uma consulta existente
   * @param id - ID da consulta
   * @param updateConsultationDto - Dados para atualização
   * @param userId - ID do usuário que está atualizando
   * @returns ConsultationResponseDto - Dados atualizados da consulta
   */
  async update(
    id: number,
    updateConsultationDto: UpdateConsultationDto,
    userId: number,
  ): Promise<ConsultationResponseDto> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['appointment'],
    });

    if (!consultation) {
      throw new NotFoundException(`Consulta com ID ${id} não encontrada`);
    }

    if (consultation.professionalId !== userId) {
      throw new ForbiddenException('Apenas o profissional que criou a consulta pode atualizá-la');
    }

    if (consultation.status === ConsultationStatus.CONCLUIDO && !updateConsultationDto.status) {
      throw new BadRequestException('Não é possível alterar consultas já concluídas');
    }

    const dataToUpdate: any = {};

    if (updateConsultationDto.notes !== undefined) {
      const { encryptedText, iv } = this.cryptographyService.encrypt(
        updateConsultationDto.notes,
        userId,
      );
      dataToUpdate.encryptedNotes = encryptedText;
      dataToUpdate.notesIV = iv;
    }

    if (updateConsultationDto.diagnosis !== undefined) {
      const { encryptedText, iv } = this.cryptographyService.encrypt(
        updateConsultationDto.diagnosis,
        userId,
      );
      dataToUpdate.encryptedDiagnosis = encryptedText;
      dataToUpdate.diagnosisIV = iv;
    }

    if (updateConsultationDto.treatmentPlan !== undefined) {
      const { encryptedText, iv } = this.cryptographyService.encrypt(
        updateConsultationDto.treatmentPlan,
        userId,
      );
      dataToUpdate.encryptedTreatmentPlan = encryptedText;
      dataToUpdate.treatmentPlanIV = iv;
    }

    if (updateConsultationDto.attentionPoints !== undefined) {
      const { encryptedText, iv } = this.cryptographyService.encrypt(
        updateConsultationDto.attentionPoints,
        userId,
      );
      dataToUpdate.encryptedAttentionPoints = encryptedText;
      dataToUpdate.attentionPointsIV = iv;
    }

    if (updateConsultationDto.status) {
      dataToUpdate.status = updateConsultationDto.status;

      if (updateConsultationDto.status === ConsultationStatus.CONCLUIDO) {
        await this.appointmentService.updateStatus(
          consultation.appointmentId,
          AppointmentStatus.CONCLUIDO,
        );
      }
    }

    const updated = this.consultationRepository.merge(consultation, dataToUpdate);
    const savedConsultation = await this.consultationRepository.save(updated);

    return this.mapToResponseDto(savedConsultation, userId);
  }

  /**
   * Remove uma consulta
   * @param id - ID da consulta
   * @param userId - ID do usuário que está solicitando a remoção
   */
  async remove(id: number, userId: number): Promise<void> {
    const consultation = await this.findOne(id, userId, UserType.PROFISSIONAL_SAUDE);

    if (consultation.status === ConsultationStatus.CONCLUIDO) {
      throw new BadRequestException('Não é possível remover consultas já concluídas');
    }

    if (consultation.professionalId !== userId) {
      throw new ForbiddenException('Apenas o profissional que criou a consulta pode removê-la');
    }

    await this.appointmentService.updateStatus(
      consultation.appointmentId,
      AppointmentStatus.AGENDADO,
    );

    const result = await this.consultationRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Consulta com ID ${id} não encontrada`);
    }
  }

  /**
   * Conclui uma consulta e seu agendamento associado
   * @param id - ID da consulta
   * @param userId - ID do usuário que está concluindo
   * @returns ConsultationResponseDto - Dados da consulta concluída
   */
  async concludeConsultation(id: number, userId: number): Promise<ConsultationResponseDto> {
    return this.update(id, { status: ConsultationStatus.CONCLUIDO }, userId);
  }

  /**
   * Retorna o histórico completo de consultas de um paciente formatado por data
   * @param patientId - ID do paciente
   * @param userId - ID do usuário que está solicitando
   * @param userRole - Papel do usuário
   * @returns PatientConsultationHistoryDto - Histórico formatado de consultas
   */
  async getPatientConsultationHistory(
    patientId: number,
    userId: number,
  ): Promise<PatientConsultationHistoryDto> {
    const consultations = await this.findByPatient(patientId, userId);

    if (consultations.length === 0) {
      throw new NotFoundException(
        `Não foram encontradas consultas para o paciente ID ${patientId}`,
      );
    }

    const sortedConsultations = consultations.sort(
      (a, b) =>
        new Date(a.appointment.appointmentDate).getTime() -
        new Date(b.appointment.appointmentDate).getTime(),
    );

    const patientName = sortedConsultations[0].appointment?.patient?.firstName || 'Paciente';

    const consultationHistory = sortedConsultations.map(consultation => {
      const appointmentDate = new Date(`${consultation.appointment.appointmentDate}T12:00:00`);
      const formattedDate = appointmentDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      return {
        formattedDate,
        consultation,
      };
    });

    return {
      patientId,
      patientName,
      consultationHistory,
    };
  }

  /**
   * Converte a entidade Consultation para DTO de resposta
   * Descriptografa os dados sensíveis se o usuário tiver permissão
   * @param consultation - Entidade Consultation
   * @param userId - ID do usuário que solicitou os dados
   * @returns ConsultationResponseDto - DTO de resposta
   */
  private mapToResponseDto(consultation: Consultation, userId: number): ConsultationResponseDto {
    const canAccessSensitiveData = consultation.professionalId === userId;

    const notes = canAccessSensitiveData
      ? this.cryptographyService.decrypt(consultation.encryptedNotes, consultation.notesIV, userId)
      : null;

    const diagnosis = canAccessSensitiveData
      ? this.cryptographyService.decrypt(
          consultation.encryptedDiagnosis,
          consultation.diagnosisIV,
          userId,
        )
      : null;

    const treatmentPlan = canAccessSensitiveData
      ? this.cryptographyService.decrypt(
          consultation.encryptedTreatmentPlan,
          consultation.treatmentPlanIV,
          userId,
        )
      : null;

    const attentionPoints = canAccessSensitiveData
      ? this.cryptographyService.decrypt(
          consultation.encryptedAttentionPoints,
          consultation.attentionPointsIV,
          userId,
        )
      : null;

    return {
      id: consultation.id,
      appointmentId: consultation.appointmentId,
      appointment: consultation.appointment
        ? this.appointmentService.mapToResponseDto(consultation.appointment)
        : null,
      notes,
      diagnosis,
      treatmentPlan,
      attentionPoints,
      status: consultation.status,
      professionalId: consultation.professionalId,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
    };
  }
}
