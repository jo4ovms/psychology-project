import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { Exclude } from 'class-transformer';

export enum ConsultationStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
}

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Appointment, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @Column({ name: 'appointment_id' })
  appointmentId: number;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  encryptedNotes: string;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  encryptedDiagnosis: string;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  encryptedTreatmentPlan: string;

  @Column({
    type: 'enum',
    enum: ConsultationStatus,
    default: ConsultationStatus.EM_ANDAMENTO,
  })
  status: ConsultationStatus;

  @Column({ name: 'professional_id' })
  professionalId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  @Exclude()
  notesIV: string;

  @Column({ nullable: true })
  @Exclude()
  diagnosisIV: string;

  @Column({ nullable: true })
  @Exclude()
  treatmentPlanIV: string;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  encryptedAttentionPoints: string;

  @Column({ nullable: true })
  @Exclude()
  attentionPointsIV: string;
}
