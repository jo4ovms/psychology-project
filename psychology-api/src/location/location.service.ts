import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface AddressResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;

  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface City {
  id: number;
  nome: string;
}

@Injectable()
export class LocationService {
  private readonly viaCepBaseUrl = 'https://viacep.com.br/ws';
  private readonly ibgeBaseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

  /**
   * Busca endereço pelo CEP usando a API ViaCEP e adiciona campos em inglês
   * @param cep - CEP a ser consultado (apenas números)
   * @returns Objeto com dados do endereço, incluindo campos traduzidos
   * @throws HttpException - Quando o CEP é inválido ou não encontrado
   */
  async findAddressByCep(cep: string): Promise<AddressResponse> {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      throw new HttpException(
        'Formato de CEP inválido. Deve conter 8 dígitos',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await axios.get<AddressResponse>(`${this.viaCepBaseUrl}/${cleanCep}/json`);

      if (response.data.erro) {
        throw new HttpException('CEP não encontrado', HttpStatus.NOT_FOUND);
      }

      const result = {
        ...response.data,
        street: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf,
      };

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.response) {
        throw new HttpException(
          `Erro ao consultar o CEP: ${error.response.data.message || 'Erro desconhecido'}`,
          error.response.status,
        );
      } else if (error.request) {
        throw new HttpException(
          'Serviço de CEP temporariamente indisponível. Tente novamente mais tarde.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        throw new HttpException(
          'Erro ao processar a consulta de CEP',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Lista todas as cidades de um determinado estado
   * @param uf - Sigla do estado (UF)
   * @returns Array de cidades
   * @throws HttpException - Quando o UF é inválido ou ocorre erro na API
   */
  async findCitiesByState(uf: string): Promise<City[]> {
    if (!uf || uf.length !== 2) {
      throw new HttpException(
        'Formato de UF inválido. Use a sigla do estado com 2 letras.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const upperUf = uf.toUpperCase();

    try {
      const response = await axios.get<City[]>(`${this.ibgeBaseUrl}/${upperUf}/municipios`);
      return response.data.map(city => ({
        id: city.id,
        nome: city.nome,
      }));
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          throw new HttpException('UF não encontrada', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          `Erro ao consultar cidades: ${error.response.data.message || 'Erro desconhecido'}`,
          error.response.status,
        );
      } else if (error.request) {
        throw new HttpException(
          'Serviço de consulta de cidades temporariamente indisponível. Tente novamente mais tarde.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        throw new HttpException(
          'Erro ao processar a consulta de cidades',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Lista todos os estados brasileiros
   * @returns Array com UFs e nomes dos estados
   */
  async findAllStates(): Promise<{ id: number; sigla: string; nome: string }[]> {
    try {
      const response = await axios.get(this.ibgeBaseUrl);
      return response.data.map(state => ({
        id: state.id,
        sigla: state.sigla,
        nome: state.nome,
      }));
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Erro ao consultar estados: ${error.response.data.message || 'Erro desconhecido'}`,
          error.response.status,
        );
      } else if (error.request) {
        throw new HttpException(
          'Serviço de consulta de estados temporariamente indisponível. Tente novamente mais tarde.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        throw new HttpException(
          'Erro ao processar a consulta de estados',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
