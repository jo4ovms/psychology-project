import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TipoUsuario } from '../tipo-usuario.enum';
import { Agendamento } from 'src/agendamento/entities/agendamento.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
  })
  tipo: TipoUsuario;

  @OneToMany(() => Agendamento, agendamento => agendamento.usuario)
  agendamentos: Agendamento[];

  @OneToMany(() => Consulta, consulta => consulta.usuario)
  consultas: Consulta[];
}
