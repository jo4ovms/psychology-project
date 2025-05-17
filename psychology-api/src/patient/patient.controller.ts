import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserType } from '../user/user-type.enum';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';

@ApiTags('pacientes')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.SECRETARIA, UserType.PROFISSIONAL_SAUDE)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo paciente' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Paciente criado com sucesso.',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'CPF já cadastrado.' })
  async create(@Body() createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pacientes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pacientes retornada com sucesso.',
    type: [PatientResponseDto],
  })
  async findAll(): Promise<PatientResponseDto[]> {
    return this.patientService.findAll();
  }

  @Get('cpf/:cpf')
  @ApiOperation({ summary: 'Buscar paciente por CPF' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paciente encontrado com sucesso.',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Paciente não encontrado.' })
  async findByCpf(@Param('cpf') cpf: string): Promise<PatientResponseDto> {
    return this.patientService.findByCpf(cpf);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar paciente por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paciente encontrado com sucesso.',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Paciente não encontrado.' })
  async findOne(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.patientService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar paciente' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paciente atualizado com sucesso.',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Paciente não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover paciente' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Paciente removido com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Paciente não encontrado.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.patientService.remove(+id);
  }
}
