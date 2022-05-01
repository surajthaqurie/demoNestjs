import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 401 { statusCode: 401, message: 'Unauthorized' }
    // 404 { success: false, status: 404, msg: 'Sorry !!! invalid credentials' } // 400 bad request
    // 400  statusCode: 400, message: ['firstName must be longer than or equal to 5 characters','First name is required' ],error: 'Bad Request'}
    // 403 { statusCode: 403, message: 'Forbidden resource', error: 'Forbidden' }

    const statusCode = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // console.log(exception.getResponse());

    const { message, error, msg, status }: any = exception.getResponse();
    // const { message }: any = exception.getResponse();
    // const { error }: any = exception.getResponse();
    // const { msg }: any = exception.getResponse();
    // const { status }: any = exception.getResponse();

    response.status(statusCode).json({
      success: false,
      status: statusCode,
      error: error || message || status,
      msg: message || msg,
      method: request.method,
      // host: request.headers.host,
      // path: request.url,
      // timestamp: new Date().toLocaleString(),
    });
  }
}
