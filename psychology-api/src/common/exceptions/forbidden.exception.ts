import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Você não tem permissão para acessar este recurso') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Acesso proibido',
        message,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
