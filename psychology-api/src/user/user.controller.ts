import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserType } from './user-type.enum';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('usuarios')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'E-mail já cadastrado.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários retornada com sucesso.',
    type: [UserResponseDto],
  })
  @ApiBearerAuth()
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil do usuário retornado com sucesso.',
    type: UserResponseDto,
  })
  @ApiBearerAuth()
  async getProfile(@GetUser() user): Promise<UserResponseDto> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado.' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'E-mail já cadastrado.' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PROFISSIONAL_SAUDE)
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado.' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }

  @Patch('profile/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Alterar senha do usuário logado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Senha alterada com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Senha atual incorreta.' })
  @ApiBearerAuth()
  async changePassword(
    @GetUser() user,
    @Body() data: { oldPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    await this.userService.changePassword(user.id, data.oldPassword, data.newPassword);
    return { message: 'Senha alterada com sucesso' };
  }
}
