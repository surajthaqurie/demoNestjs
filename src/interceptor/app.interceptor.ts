import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { tap, map } from 'rxjs/operators';

import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable()
/* export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();

    console.log('Endpont: ', request.url);
    console.log('Method ', request.method);

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
} */
export class AppInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('im suers');
    // const request = context.switchToHttp().getResponse();
    // console.log('first call', request.headers.authorization);

    /*  return next.handle().pipe(
      map((data) => {
        return {
          ...data,
          newData: 'test nepal',
        };
      }),
    ); */

    let redisCache = true;
    if (redisCache) {
      return of([
        {
          id: 1,
          message: 'data from cache',
        },
      ]);
    }

    return next.handle();
  }
}


// req -->  interceptor -----> result

// res<------ interceptor <------ result