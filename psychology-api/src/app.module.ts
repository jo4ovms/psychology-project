import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ClienteModule } from './cliente/cliente.module';
import { EnderecoModule } from './endereco/endereco.module';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { ConsultaModule } from './consulta/consulta.module';

@Module({
  imports: [UsuarioModule, ClienteModule, EnderecoModule, AgendamentoModule, ConsultaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
