import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { StatusAgendamento } from '../status-agendamento.enum';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, cliente => cliente.agendamentos)
  @JoinColumn()
  cliente: Cliente;

  @Column({ type: 'date' })
  data: Date;

  @Column()
  hora: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'date' })
  dataAgendamento: Date;

  @Column({
    type: 'enum',
    enum: StatusAgendamento,
    default: StatusAgendamento.EM_ANDAMENTO,
  })
  status: StatusAgendamento;

  @ManyToOne(() => Usuario, usuario => usuario.agendamentos)
  @JoinColumn()
  usuario: Usuario;

  @OneToOne(() => Consulta, consulta => consulta.agendamento, { nullable: true })
  consulta: Consulta;
}
