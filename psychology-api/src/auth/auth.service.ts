import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida credenciais de um usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Entidade do usuário (se validado)
   * @throws UnauthorizedException - Quando credenciais são inválidas
   */
  async validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  /**
   * Realiza login de um usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Token JWT e dados do usuário
   * @throws UnauthorizedException - Quando credenciais são inválidas
   */
  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      return this.userService.login(user);
    } catch {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  /**
   * Gera token para usuário já autenticado
   * @param user - Usuário autenticado
   * @returns Token JWT e dados do usuário
   */
  async loginWithUser(user: any) {
    return this.userService.login(user);
  }
}
