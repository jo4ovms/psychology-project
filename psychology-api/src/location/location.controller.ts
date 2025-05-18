import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { LocationService, AddressResponse, City } from './location.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('localidades')
@Controller('locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('cep/:cep')
  @ApiOperation({ summary: 'Busca endereço pelo CEP' })
  @ApiParam({
    name: 'cep',
    description: 'CEP a ser consultado (apenas números)',
    example: '01001000',
  })
  @ApiResponse({
    status: 200,
    description: 'Endereço encontrado',
    schema: {
      example: {
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        complemento: 'lado ímpar',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        gia: '1004',
        ddd: '11',
        siafi: '7107',
        street: 'Praça da Sé',
        neighborhood: 'Sé',
        city: 'São Paulo',
        state: 'SP',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'CEP em formato inválido' })
  @ApiResponse({ status: 404, description: 'CEP não encontrado' })
  async findAddressByCep(@Param('cep') cep: string): Promise<AddressResponse> {
    return this.locationService.findAddressByCep(cep);
  }

  @Get('states/:uf/cities')
  @ApiOperation({ summary: 'Lista cidades de um estado' })
  @ApiParam({ name: 'uf', description: 'Sigla do estado (UF)', example: 'SP' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cidades',
    schema: {
      example: [
        { id: 3500105, nome: 'Adamantina' },
        { id: 3500204, nome: 'Adolfo' },
        { id: 3500303, nome: 'Aguaí' },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'UF em formato inválido' })
  @ApiResponse({ status: 404, description: 'UF não encontrada' })
  async findCitiesByState(@Param('uf') uf: string): Promise<City[]> {
    return this.locationService.findCitiesByState(uf);
  }

  @Get('states')
  @ApiOperation({ summary: 'Lista todos os estados brasileiros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados',
    schema: {
      example: [
        { id: 12, sigla: 'AC', nome: 'Acre' },
        { id: 27, sigla: 'AL', nome: 'Alagoas' },
        { id: 13, sigla: 'AM', nome: 'Amazonas' },
      ],
    },
  })
  async findAllStates(): Promise<{ id: number; sigla: string; nome: string }[]> {
    return this.locationService.findAllStates();
  }
}
