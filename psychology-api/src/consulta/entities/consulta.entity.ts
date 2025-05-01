import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Agendamento } from 'src/agendamento/entities/agendamento.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity('consultas')
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Agendamento, agendamento => agendamento.consulta)
  @JoinColumn()
  agendamento: Agendamento;

  @Column({ type: 'text' })
  anotacoes: string;

  @Column({ type: 'text' })
  pontosAtencao: string;

  @ManyToOne(() => Usuario, usuario => usuario.consultas)
  @JoinColumn()
  usuario: Usuario;
}
