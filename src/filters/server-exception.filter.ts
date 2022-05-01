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

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * @description Exception json response
     * @param message
     */
    // console.log(exception.getResponse());

    // { success: false, status: 'Conflict', msg: 'Sorry !!! this email address is already taken'}
    let errorMessage: string;
    let errorStatus: string;

    if (exception instanceof HttpException) {
      const { msg }: any = exception.getResponse();
      const { status }: any = exception.getResponse();

      errorMessage = msg;
      errorStatus = status;
    }

    // const { status, msg }: any = exception?.getResponse();

    const responseMessage = (type: string, message: string) => {
      response.status(statusCode).json({
        success: false,
        status: statusCode,
        error: type || errorStatus,
        msg: message || errorMessage,
        method: request.method,
        // host: request.headers.host,
        // path: request.url,
        // timestamp: new Date().toLocaleString(),
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
