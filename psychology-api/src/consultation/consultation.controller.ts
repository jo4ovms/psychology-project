import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserType } from '../user/user-type.enum';
import { PatientConsultationHistoryDto } from './dto/patient-consultation-history.dto';

@ApiTags('consultas')
@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Post()
  @Roles(UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Cria uma nova consulta' })
  @ApiResponse({
    status: 201,
    description: 'Consulta criada com sucesso',
    type: ConsultationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiBody({ type: CreateConsultationDto })
  create(@Body() createConsultationDto: CreateConsultationDto, @Req() req) {
    return this.consultationService.create(createConsultationDto, req.user.id);
  }

  @Get()
  @Roles(UserType.SECRETARIA, UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Lista todas as consultas que o usuário tem acesso' })
  @ApiResponse({
    status: 200,
    description: 'Lista de consultas',
    type: [ConsultationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(@Req() req) {
    return this.consultationService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @Roles(UserType.SECRETARIA, UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Busca uma consulta pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da consulta' })
  @ApiResponse({
    status: 200,
    description: 'Consulta encontrada',
    type: ConsultationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 404, description: 'Consulta não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.consultationService.findOne(id, req.user.id, req.user.role);
  }

  @Get('patient/:patientId')
  @Roles(UserType.SECRETARIA, UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Lista consultas de um paciente específico' })
  @ApiParam({ name: 'patientId', description: 'ID do paciente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de consultas do paciente',
    type: [ConsultationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number, @Req() req) {
    return this.consultationService.findByPatient(patientId, req.user.id);
  }

  @Patch(':id')
  @Roles(UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Atualiza uma consulta' })
  @ApiParam({ name: 'id', description: 'ID da consulta' })
  @ApiBody({ type: UpdateConsultationDto })
  @ApiResponse({
    status: 200,
    description: 'Consulta atualizada com sucesso',
    type: ConsultationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 404, description: 'Consulta não encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConsultationDto: UpdateConsultationDto,
    @Req() req,
  ) {
    return this.consultationService.update(id, updateConsultationDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Remove uma consulta' })
  @ApiParam({ name: 'id', description: 'ID da consulta' })
  @ApiResponse({ status: 204, description: 'Consulta removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 404, description: 'Consulta não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.consultationService.remove(id, req.user.id);
  }

  @Patch(':id/conclude')
  @Roles(UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Conclui uma consulta' })
  @ApiParam({ name: 'id', description: 'ID da consulta' })
  @ApiResponse({
    status: 200,
    description: 'Consulta concluída com sucesso',
    type: ConsultationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 404, description: 'Consulta não encontrada' })
  conclude(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.consultationService.concludeConsultation(id, req.user.id);
  }

  @Get('patient/:patientId/history')
  @Roles(UserType.SECRETARIA, UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Retorna o histórico completo de consultas de um paciente' })
  @ApiParam({ name: 'patientId', description: 'ID do paciente' })
  @ApiResponse({
    status: 200,
    description: 'Histórico de consultas do paciente',
    type: PatientConsultationHistoryDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Paciente ou consultas não encontrados' })
  getPatientConsultationHistory(@Param('patientId', ParseIntPipe) patientId: number, @Req() req) {
    return this.consultationService.getPatientConsultationHistory(patientId, req.user.id);
  }
}
