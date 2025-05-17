import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { Consultation } from './entities/consultation.entity';
import { AppointmentModule } from '../appointment/appointment.module';
import { CryptographyService } from 'src/common/crypt/cryptography.service';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation]), AppointmentModule],
  controllers: [ConsultationController],
  providers: [ConsultationService, CryptographyService],
  exports: [ConsultationService],
})
export class ConsultationModule {}
