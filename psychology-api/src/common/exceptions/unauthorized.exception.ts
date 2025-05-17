import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Acesso não autorizado') {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Não autorizado',
        message,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
