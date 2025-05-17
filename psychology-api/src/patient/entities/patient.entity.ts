import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cpf: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column()
  homeZipCode: string;

  @Column()
  homeStreet: string;

  @Column()
  homeNumber: string;

  @Column()
  homeNeighborhood: string;

  @Column()
  homeState: string;

  @Column()
  homeCity: string;

  @Column({ default: true })
  useSameAddress: boolean;

  @Column({ nullable: true })
  billingZipCode: string;

  @Column({ nullable: true })
  billingStreet: string;

  @Column({ nullable: true })
  billingNumber: string;

  @Column({ nullable: true })
  billingNeighborhood: string;

  @Column({ nullable: true })
  billingState: string;

  @Column({ nullable: true })
  billingCity: string;

  @Column()
  phone: string;

  @Column()
  whatsapp: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
