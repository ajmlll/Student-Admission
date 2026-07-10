import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse();
      
      if (typeof resContent === 'object' && resContent !== null) {
        const tempMsg = (resContent as any).message;
        if (tempMsg) {
          message = tempMsg;
        }
        const tempErr = (resContent as any).error;
        if (tempErr) {
          error = tempErr;
        } else {
          error = exception.name;
        }
      } else {
        message = resContent as string;
        error = exception.name;
      }
    } else if (exception instanceof Error) {
      // Handle generic JS/TS errors
      message = exception.message;
      error = exception.name;
    }

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
