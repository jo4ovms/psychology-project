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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserType } from '../user/user-type.enum';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@ApiTags('agendamentos')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.SECRETARIA, UserType.PROFISSIONAL_SAUDE)
@ApiBearerAuth()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo agendamento' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Agendamento criado com sucesso.',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflito de horário.' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() user,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.create(createAppointmentDto, user.sub || user.id);
  }
  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de agendamentos retornada com sucesso.',
    type: [AppointmentResponseDto],
  })
  async findAll(): Promise<AppointmentResponseDto[]> {
    return this.appointmentService.findAll();
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Buscar agendamentos por data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de agendamentos da data retornada com sucesso.',
    type: [AppointmentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Data inválida.' })
  async findByDate(@Param('date') date: string): Promise<AppointmentResponseDto[]> {
    return this.appointmentService.findByDate(date);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Buscar agendamentos por paciente' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de agendamentos do paciente retornada com sucesso.',
    type: [AppointmentResponseDto],
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Paciente não encontrado.' })
  async findByPatient(@Param('patientId') patientId: string): Promise<AppointmentResponseDto[]> {
    return this.appointmentService.findByPatient(+patientId);
  }

  @Get('available-times')
  @ApiOperation({ summary: 'Buscar horários disponíveis para uma data' })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Data para verificar horários disponíveis (YYYY-MM-DD)',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de horários disponíveis retornada com sucesso.',
    type: [String],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Data inválida.' })
  async getAvailableTimeSlots(@Query('date') date: string): Promise<string[]> {
    return this.appointmentService.getAvailableTimeSlots(date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agendamento encontrado com sucesso.',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Agendamento não encontrado.' })
  async findOne(@Param('id') id: string): Promise<AppointmentResponseDto> {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agendamento atualizado com sucesso.',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Agendamento não encontrado.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflito de horário.' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status do agendamento atualizado com sucesso.',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Status inválido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Agendamento não encontrado.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.updateStatus(+id, updateStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover agendamento' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Agendamento removido com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Agendamento não encontrado.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Agendamento não pode ser removido.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.appointmentService.remove(+id);
  }
}
