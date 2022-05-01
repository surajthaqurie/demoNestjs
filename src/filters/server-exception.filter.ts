import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * @description Exception json response
     * @param message
     */

    const responseMessage = (type: string, message: string) => {
      response.status(status).json({
        status: status,
        error: type,
        msg: message,
        host: request.headers.host,
        path: request.url,
        method: request.method,
        timestamp: new Date().toLocaleString(),
      });
    };

    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    if (!exception.name) {
      return responseMessage('Error', exception.message);
    } else {
      return responseMessage(exception.name, exception.message);
    }
  }
}
