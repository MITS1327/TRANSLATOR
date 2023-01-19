import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomBytes } from 'crypto';
import * as graylog from 'graylog2';
import { LogTopic } from '@common/enums/logger.enums';
import { Reflector } from '@nestjs/core';

/**
 * Interceptor that logs input/output requests to graylog
 */
@Injectable()
export class GraylogInterceptor implements NestInterceptor {
  private logger = new Logger(LogTopic.Api);
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

  /**
   * Intercept method, logs before and after the request being processed
   * @param { ExecutionContext } context details about the current request
   * @param { CallHandler } next implements the handle method that returns an Observable
   */
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

  /**
   * Logs the request response in success cases
   * @param { unknown } responseData body returned
   * @param { ExecutionContext } context details about the current request
   * @param { Record<string, unknown> } graylogParams default graylog data
   * @param { Record<string, unknown> } additionalParams additional data for graylog
   */
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

  /**
   * Logs the response in error cases
   * @param { Error } error Error object
   * @param { ExecutionContext } context details about the current request
   * @param { Record<string, unknown> } graylogParams default graylog data
   * @param { Record<string, unknown> } additionalParams additional data for graylog
   */
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
