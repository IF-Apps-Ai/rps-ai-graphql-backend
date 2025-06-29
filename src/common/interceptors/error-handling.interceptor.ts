import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorHandlingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const operationName = info?.operation?.name?.value || 'Unknown';
    const fieldName = info?.fieldName || 'Unknown';

    return next.handle().pipe(
      catchError((error) => {
        // Log the error with context
        this.logger.error(
          `Error in ${operationName}.${fieldName}: ${error.message}`,
          error.stack,
        );

        // You can add custom error handling logic here
        // Example: Send to error tracking service, transform error, etc.

        return throwError(() => error);
      }),
    );
  }
}
