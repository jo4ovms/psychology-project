import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Cria um novo usuário no sistema
   * @param createUseroDto - Dados para criação do usuário
   * @returns UsuarioResponseDto - Dados do usuário criado (sem a senha)
   * @throws ConflictException - Quando o email já está cadastrado
   */
  async create(createUseroDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUseroDto.email },
    });

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUseroDto.password, salt);

    const newUser = this.userRepository.create({
      name: createUseroDto.name,
      email: createUseroDto.email,
      password: hashedPassword,
      role: createUseroDto.role,
    });

    const savedUser = await this.userRepository.save(newUser);

    return this.mapToResponseDto(savedUser);
  }

  /**
   * Lista todos os usuários do sistema
   * @returns Array de UsuarioResponseDto - Lista de usuários sem informações sensíveis
   */
  async findAll(): Promise<UserResponseDto[]> {
    const usuarios = await this.userRepository.find();
    return usuarios.map(usuario => this.mapToResponseDto(usuario));
  }

  /**
   * Busca um usuário pelo ID
   * @param id - ID do usuário
   * @returns UserResponseDto - Dados do usuário sem informações sensíveis
   * @throws NotFoundException - Quando o usuário não é encontrado
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Busca um usuário pelo email (inclui senha para validação)
   * @param email - Email do usuário
   * @returns Usuario - Entidade completa do usuário (para validação interna)
   * @throws NotFoundException - Quando o usuário não é encontrado
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    return user;
  }

  /**
   * Atualiza dados de um usuário
   * @param id - ID do usuário
   * @param updateUsuarioDto - Dados para atualização (todos opcionais)
   * @returns UsuarioResponseDto - Dados atualizados do usuário
   * @throws NotFoundException - Quando o usuário não é encontrado
   * @throws ConflictException - Quando tenta atualizar para um email já existente
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updated = this.userRepository.merge(user, updateUserDto);
    const savedUser = await this.userRepository.save(updated);

    return this.mapToResponseDto(savedUser);
  }

  /**
   * Remove um usuário do sistema
   * @param id - ID do usuário
   * @throws NotFoundException - Quando o usuário não é encontrado
   */
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
  }

  /**
   * Valida credenciais de um usuário
   * @param email - Email para login
   * @param password - Senha para validação
   * @returns Usuario - Entidade do usuário (com senha) em caso de sucesso
   * @throws UnauthorizedException - Quando as credenciais são inválidas
   */
  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  /**
   * Gera token JWT para autenticação
   * @param user - Usuário autenticado
   * @returns Token JWT e dados do usuário
   */
  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),

      user: this.mapToResponseDto(user),
    };
  }

  /**
   * Altera a senha do usuário
   * @param userId - ID do usuário
   * @param oldPassword - Senha atual para validação
   * @param newPassword - Nova senha a ser definida
   * @throws BadRequestException - Quando a senha atual é inválida
   * @throws NotFoundException - Quando o usuário não é encontrado
   */
  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado`);
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  /**
   * Converte entidade Usuario para DTO de resposta (sem dados sensíveis)
   * @param usuario - Entidade Usuario
   * @returns UsuarioResponseDto - DTO sem dados sensíveis
   */
  public mapToResponseDto(usuario: User): UserResponseDto {
    return {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
    };
  }
}
