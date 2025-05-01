import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Endereco } from 'src/endereco/entities/endereco.entity';
import { Agendamento } from 'src/agendamento/entities/agendamento.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cpf: string;

  @Column()
  nome: string;

  @Column()
  sobrenome: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @OneToOne(() => Endereco)
  @JoinColumn()
  enderecoDomiciliar: Endereco;

  @OneToOne(() => Endereco, { nullable: true })
  @JoinColumn()
  enderecoCobranca: Endereco;

  @Column()
  telefone: string;

  @Column()
  whatsapp: string;

  @Column()
  email: string;

  @OneToMany(() => Agendamento, agendamento => agendamento.cliente)
  agendamentos: Agendamento[];
}
