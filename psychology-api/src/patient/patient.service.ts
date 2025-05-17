import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  /**
   * Cria um novo paciente no sistema
   * @param createPatientDto - Dados para criação do paciente
   * @returns PatientResponseDto - Dados do paciente criado
   * @throws ConflictException - Quando o CPF já está cadastrado
   */
  async create(createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    const existingPatient = await this.patientRepository.findOne({
      where: { cpf: createPatientDto.cpf },
    });

    if (existingPatient) {
      throw new ConflictException('CPF já cadastrado');
    }

    if (!createPatientDto.useSameAddress) {
      if (
        !createPatientDto.billingZipCode ||
        !createPatientDto.billingStreet ||
        !createPatientDto.billingNumber ||
        !createPatientDto.billingNeighborhood ||
        !createPatientDto.billingState ||
        !createPatientDto.billingCity
      ) {
        throw new BadRequestException('Endereço de cobrança incompleto');
      }
    }

    const newPatient = this.patientRepository.create(createPatientDto);
    const savedPatient = await this.patientRepository.save(newPatient);

    return this.mapToResponseDto(savedPatient);
  }

  /**
   * Lista todos os pacientes do sistema em ordem alfabética
   * @returns Array de PatientResponseDto - Lista de pacientes
   */
  async findAll(): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.find({
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });
    return patients.map(patient => this.mapToResponseDto(patient));
  }

  /**
   * Busca um paciente pelo ID
   * @param id - ID do paciente
   * @returns PatientResponseDto - Dados do paciente
   * @throws NotFoundException - Quando o paciente não é encontrado
   */
  async findOne(id: number): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({ where: { id } });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }

    return this.mapToResponseDto(patient);
  }

  /**
   * Busca um paciente pelo CPF
   * @param cpf - CPF do paciente
   * @returns PatientResponseDto - Dados do paciente
   * @throws NotFoundException - Quando o paciente não é encontrado
   */
  async findByCpf(cpf: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({ where: { cpf } });

    if (!patient) {
      throw new NotFoundException(`Paciente com CPF ${cpf} não encontrado`);
    }

    return this.mapToResponseDto(patient);
  }

  /**
   * Atualiza dados de um paciente
   * @param id - ID do paciente
   * @param updatePatientDto - Dados para atualização
   * @returns PatientResponseDto - Dados atualizados do paciente
   * @throws NotFoundException - Quando o paciente não é encontrado
   */
  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }

    if (updatePatientDto.useSameAddress === false) {
      const billingComplete =
        (patient.billingZipCode || updatePatientDto.billingZipCode) &&
        (patient.billingStreet || updatePatientDto.billingStreet) &&
        (patient.billingNumber || updatePatientDto.billingNumber) &&
        (patient.billingNeighborhood || updatePatientDto.billingNeighborhood) &&
        (patient.billingState || updatePatientDto.billingState) &&
        (patient.billingCity || updatePatientDto.billingCity);

      if (!billingComplete) {
        throw new BadRequestException('Endereço de cobrança incompleto');
      }
    }

    if (updatePatientDto.useSameAddress === true) {
      updatePatientDto.billingZipCode = null;
      updatePatientDto.billingStreet = null;
      updatePatientDto.billingNumber = null;
      updatePatientDto.billingNeighborhood = null;
      updatePatientDto.billingState = null;
      updatePatientDto.billingCity = null;
    }

    const updated = this.patientRepository.merge(patient, updatePatientDto);
    const savedPatient = await this.patientRepository.save(updated);

    return this.mapToResponseDto(savedPatient);
  }

  /**
   * Remove um paciente do sistema
   * @param id - ID do paciente
   * @throws NotFoundException - Quando o paciente não é encontrado
   */
  async remove(id: number): Promise<void> {
    const result = await this.patientRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }
  }

  /**
   * Converte entidade Patient para DTO de resposta
   * @param patient - Entidade Patient
   * @returns PatientResponseDto - DTO de resposta
   */
  private mapToResponseDto(patient: Patient): PatientResponseDto {
    return {
      id: patient.id,
      cpf: patient.cpf,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      homeZipCode: patient.homeZipCode,
      homeStreet: patient.homeStreet,
      homeNumber: patient.homeNumber,
      homeNeighborhood: patient.homeNeighborhood,
      homeState: patient.homeState,
      homeCity: patient.homeCity,
      useSameAddress: patient.useSameAddress,
      billingZipCode: patient.billingZipCode,
      billingStreet: patient.billingStreet,
      billingNumber: patient.billingNumber,
      billingNeighborhood: patient.billingNeighborhood,
      billingState: patient.billingState,
      billingCity: patient.billingCity,
      phone: patient.phone,
      whatsapp: patient.whatsapp,
      email: patient.email,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }
}
