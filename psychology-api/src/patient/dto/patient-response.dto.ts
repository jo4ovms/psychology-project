import { ApiProperty } from '@nestjs/swagger';

export class PatientResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '123.456.789-00' })
  cpf: string;

  @ApiProperty({ example: 'João' })
  firstName: string;

  @ApiProperty({ example: 'Silva' })
  lastName: string;

  @ApiProperty({ example: '1990-01-01' })
  birthDate: Date;

  @ApiProperty({ example: '12345-678' })
  homeZipCode: string;

  @ApiProperty({ example: 'Rua das Flores' })
  homeStreet: string;

  @ApiProperty({ example: '123' })
  homeNumber: string;

  @ApiProperty({ example: 'Centro' })
  homeNeighborhood: string;

  @ApiProperty({ example: 'SP' })
  homeState: string;

  @ApiProperty({ example: 'São Paulo' })
  homeCity: string;

  @ApiProperty({ example: true })
  useSameAddress: boolean;

  @ApiProperty({ example: '12345-678', nullable: true })
  billingZipCode?: string;

  @ApiProperty({ example: 'Rua das Flores', nullable: true })
  billingStreet?: string;

  @ApiProperty({ example: '123', nullable: true })
  billingNumber?: string;

  @ApiProperty({ example: 'Centro', nullable: true })
  billingNeighborhood?: string;

  @ApiProperty({ example: 'SP', nullable: true })
  billingState?: string;

  @ApiProperty({ example: 'São Paulo', nullable: true })
  billingCity?: string;

  @ApiProperty({ example: '(11) 98765-4321' })
  phone: string;

  @ApiProperty({ example: '(11) 98765-4321' })
  whatsapp: string;

  @ApiProperty({ example: 'joao@email.com' })
  email: string;

  @ApiProperty({ example: '2023-04-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-04-01T00:00:00.000Z' })
  updatedAt: Date;
}
