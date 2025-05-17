import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        this.logger.error(`Error in request: ${error.message}`, error.stack);

        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        if (error.code === '23505') {
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: 409,
                  error: 'Conflito',
                  message: 'Registro duplicado detectado',
                },
                409,
              ),
          );
        }

        return throwError(
          () =>
            new HttpException(
              {
                statusCode: 500,
                error: 'Erro interno',
                message: 'Ocorreu um erro interno no servidor',
              },
              500,
            ),
        );
      }),
    );
  }
}
