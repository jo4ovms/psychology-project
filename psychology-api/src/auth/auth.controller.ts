import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário autenticado com sucesso.',
    schema: {
      properties: {
        accessToken: { type: 'string', description: 'Token JWT para autenticação' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            nome: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['PROFISSIONAL_SAUDE', 'SECRETARIA'] },
          },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('validate')
  @ApiOperation({ summary: 'Validar credenciais' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credenciais válidas.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Credenciais inválidas.' })
  async validate(@Request() req): Promise<UserResponseDto> {
    return req.user;
  }
}
