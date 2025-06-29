import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const operationName = info?.operation?.name?.value || 'Unknown';
    const fieldName = info?.fieldName || 'Unknown';

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Log slow operations (> 1 second)
        if (duration > 1000) {
          this.logger.warn(
            `Slow operation detected: ${operationName}.${fieldName} took ${duration}ms`,
          );
        } else if (duration > 500) {
          this.logger.log(
            `Operation: ${operationName}.${fieldName} took ${duration}ms`,
          );
        }

        // You can also send metrics to external monitoring systems here
        // Example: MetricsService.recordOperationTime(operationName, fieldName, duration);
      }),
    );
  }
}
