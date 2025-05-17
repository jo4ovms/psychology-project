import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserType } from '../user-type.enum';

/**
 * DTO para criação de um novo usuário no sistema
 * @class CreateUsuarioDto
 */
export class CreateUserDto {
  /**
   * Nome completo do usuário
   * @example "João Silva"
   */
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  /**
   * Email do usuário (deve ser único no sistema)
   * @example "joao.silva@email.com"
   */
  @ApiProperty({
    description: 'Email do usuário (deve ser único no sistema)',
    example: 'joao.silva@email.com',
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email informado é inválido' })
  email: string;

  /**
   * Senha do usuário (será hasheada antes de ser armazenada)
   * @example "Senha@123"
   * @minLength 6
   */
  @ApiProperty({
    description: 'Senha do usuário (será hasheada antes de ser armazenada)',
    example: 'Senha@123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  /**
   * Tipo do usuário (SECRETARIA, PROFISSIONAL_SAUDE)
   * @example "SECRETARIA"
   */
  @ApiProperty({
    description: 'Tipo do usuário no sistema',
    enum: UserType,
    example: UserType.PROFISSIONAL_SAUDE,
  })
  @IsNotEmpty({ message: 'O tipo do usuário é obrigatório' })
  @IsEnum(UserType, {
    message: `O tipo do usuário deve ser um dos seguintes valores: ${Object.values(UserType).join(', ')}`,
  })
  role: UserType;
}
