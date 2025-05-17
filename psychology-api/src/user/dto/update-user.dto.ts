import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserType } from '../user-type.enum';

/**
 * DTO para atualização de dados de um usuário existente
 * @class UpdateUsuarioDto
 */
export class UpdateUserDto {
  /**
   * Nome completo do usuário
   * @example "João Silva"
   */
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  name?: string;

  /**
   * Email do usuário (deve ser único no sistema)
   * @example "joao.silva@email.com"
   */
  @ApiPropertyOptional({
    description: 'Email do usuário (deve ser único no sistema)',
    example: 'joao.silva@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'O email informado é inválido' })
  email?: string;

  /**
   * Senha do usuário (será hasheada antes de ser armazenada)
   * @example "Senha@123"
   * @minLength 6
   */
  @ApiPropertyOptional({
    description: 'Senha do usuário (será hasheada antes de ser armazenada)',
    example: 'Senha@123',
    minLength: 6,
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password?: string;

  /**
   * Tipo do usuário (PROFISSIONAL_SAUDE, SECRETARIA)
   * @example "PROFISSIONAL_SAUDE"
   */
  @ApiPropertyOptional({
    description: 'Tipo do usuário no sistema',
    enum: UserType,
    example: UserType.PROFISSIONAL_SAUDE,
  })
  @IsOptional()
  @IsEnum(UserType, {
    message: `O tipo do usuário deve ser um dos seguintes valores: ${Object.values(UserType).join(', ')}`,
  })
  role?: UserType;
}
