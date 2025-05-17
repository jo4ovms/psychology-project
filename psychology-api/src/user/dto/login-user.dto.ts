import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO para autenticação de usuário no sistema
 * @class LoginUsuarioDto
 */
export class LoginUserDto {
  /**
   * Email do usuário para login
   * @example "joao.silva@email.com"
   */
  @ApiProperty({
    description: 'Email do usuário para login',
    example: 'joao.silva@email.com',
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email informado é inválido' })
  email: string;

  /**
   * Senha do usuário para login
   * @example "Senha@123"
   * @minLength 6
   */
  @ApiProperty({
    description: 'Senha do usuário para login',
    example: 'Senha@123',
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
