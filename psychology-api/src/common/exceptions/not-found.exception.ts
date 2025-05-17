import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(resource: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Recurso não encontrado',
        message: `${resource} não encontrado(a)`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
