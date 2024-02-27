import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { randomBytes } from 'crypto';
import * as graylog from 'graylog2';

@Injectable()
export class GraylogInterceptor implements NestInterceptor {
  private logger = new Logger();
  private graylog = null;
  private reflector: Reflector;
  constructor(host: string, port: string, project: string) {
    this.graylog = new graylog.graylog({
      servers: [{ host, port }],
      hostname: project,
      facility: 'Nest.js',
      bufferSize: 1350,
    });

    this.graylog.on('error', (error: Error) => {
      this.logger.error(error);
    });

    this.reflector = new Reflector();
  }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();
    const shouldSkip =
      this.reflector.get<boolean>('GRAYLOG_INTERCEPTOR_SKIP', context.getClass()) ||
      this.reflector.get<boolean>('GRAYLOG_INTERCEPTOR_SKIP', context.getHandler());
    if (shouldSkip) {
      return next.handle();
    }

    const { method, url, body, headers, query, params, route } = request;
    const message = `Incoming request - ${method} - ${url}`;

    const uniqueKey = randomBytes(20).toString('hex');
    const graylogParams = {
      message,
      method,
      headers,
      query,
      params,
      body,
    };
    const additionalParams = {
      accountId: headers['mcn-account-id'],
      method: route?.path,
      key: uniqueKey,
    };

    this.graylog.log(message, graylogParams, additionalParams);

    return next.handle().pipe(
      tap({
        next: (val: unknown): void => {
          this.logNext(val, context, graylogParams, additionalParams);
        },
        error: (err: Error): void => {
          this.logError(err, context, graylogParams, additionalParams);
        },
      }),
    );
  }

  private logNext(
    responseData: unknown,
    context: ExecutionContext,
    graylogParams: Record<string, unknown>,
    additionalParams: Record<string, unknown>,
  ): void {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const { statusCode } = response;
    const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;

    this.graylog.log(message, graylogParams, {
      ...additionalParams,
      responseData,
    });
  }

  private logError(
    error: Error,
    context: ExecutionContext,
    graylogParams: Record<string, unknown>,
    additionalParams: Record<string, unknown>,
  ): void {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    if (error instanceof HttpException) {
      const statusCode: number = error.getStatus();
      const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.graylog.error(message, graylogParams, {
          ...additionalParams,
          error,
        });
      } else {
        this.graylog.warn(message, graylogParams, {
          ...additionalParams,
          error,
        });
      }
    } else {
      this.graylog.error(`Outgoing response - ${method} - ${url}`);
    }
  }
}
