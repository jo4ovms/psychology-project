import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ description: 'CPF do paciente', example: '123.456.789-00' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString({ message: 'CPF deve ser uma string' })
  cpf: string;

  @ApiProperty({ description: 'Nome do paciente', example: 'João' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  firstName: string;

  @ApiProperty({ description: 'Sobrenome do paciente', example: 'Silva' })
  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @IsString({ message: 'Sobrenome deve ser uma string' })
  lastName: string;

  @ApiProperty({ description: 'Data de nascimento', example: '1990-01-01' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @IsDate({ message: 'Data de nascimento deve ser uma data válida' })
  birthDate: Date;

  @ApiProperty({ description: 'CEP do endereço residencial', example: '12345-678' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString({ message: 'CEP deve ser uma string' })
  homeZipCode: string;

  @ApiProperty({ description: 'Logradouro do endereço residencial', example: 'Rua das Flores' })
  @IsNotEmpty({ message: 'Logradouro é obrigatório' })
  @IsString({ message: 'Logradouro deve ser uma string' })
  homeStreet: string;

  @ApiProperty({ description: 'Número da residência', example: '123' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString({ message: 'Número deve ser uma string' })
  homeNumber: string;

  @ApiProperty({ description: 'Bairro da residência', example: 'Centro' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString({ message: 'Bairro deve ser uma string' })
  homeNeighborhood: string;

  @ApiProperty({ description: 'Estado da residência', example: 'SP' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString({ message: 'Estado deve ser uma string' })
  homeState: string;

  @ApiProperty({ description: 'Cidade da residência', example: 'São Paulo' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString({ message: 'Cidade deve ser uma string' })
  homeCity: string;

  @ApiProperty({ description: 'Usar mesmo endereço para cobrança', example: true })
  @IsBoolean({ message: 'useSameAddress deve ser um boolean' })
  useSameAddress: boolean;

  @ApiProperty({
    description: 'CEP do endereço de cobrança',
    example: '12345-678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'CEP deve ser uma string' })
  billingZipCode?: string;

  @ApiProperty({
    description: 'Logradouro do endereço de cobrança',
    example: 'Rua das Flores',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Logradouro deve ser uma string' })
  billingStreet?: string;

  @ApiProperty({ description: 'Número do endereço de cobrança', example: '123', required: false })
  @IsOptional()
  @IsString({ message: 'Número deve ser uma string' })
  billingNumber?: string;

  @ApiProperty({
    description: 'Bairro do endereço de cobrança',
    example: 'Centro',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bairro deve ser uma string' })
  billingNeighborhood?: string;

  @ApiProperty({ description: 'Estado do endereço de cobrança', example: 'SP', required: false })
  @IsOptional()
  @IsString({ message: 'Estado deve ser uma string' })
  billingState?: string;

  @ApiProperty({
    description: 'Cidade do endereço de cobrança',
    example: 'São Paulo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Cidade deve ser uma string' })
  billingCity?: string;

  @ApiProperty({ description: 'Telefone/Celular do paciente', example: '(11) 98765-4321' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsString({ message: 'Telefone deve ser uma string' })
  phone: string;

  @ApiProperty({ description: 'Número de WhatsApp do paciente', example: '(11) 98765-4321' })
  @IsNotEmpty({ message: 'WhatsApp é obrigatório' })
  @IsString({ message: 'WhatsApp deve ser uma string' })
  whatsapp: string;

  @ApiProperty({ description: 'Email do paciente', example: 'joao@email.com' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  email: string;
}
