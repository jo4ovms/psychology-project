import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../user-type.enum';

/**
 * DTO para retorno de dados do usuário (sem informações sensíveis)
 * @class UsuarioResponseDto
 */
export class UserResponseDto {
  /**
   * ID único do usuário
   * @example 1
   */
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  id: number;

  /**
   * Nome completo do usuário
   * @example "João Silva"
   */
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  /**
   * Email do usuário
   * @example "joao.silva@email.com"
   */
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@email.com',
  })
  email: string;

  /**
   * Tipo do usuário no sistema
   * @example "PROFISSIONAL_SAUDE"
   */
  @ApiProperty({
    description: 'Tipo do usuário no sistema',
    enum: UserType,
    example: UserType.PROFISSIONAL_SAUDE,
  })
  role: UserType;
}
