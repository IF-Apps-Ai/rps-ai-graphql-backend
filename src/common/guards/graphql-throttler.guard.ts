import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphQLThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    
    // For GraphQL, we need to handle the context differently
    if (ctx.req && ctx.res) {
      return { req: ctx.req, res: ctx.res };
    }
    
    // If GraphQL context doesn't have req/res, try HTTP context
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();
    
    if (request && response) {
      return { req: request, res: response };
    }
    
    // Fallback - create mock objects to prevent errors
    return {
      req: {
        ip: '127.0.0.1',
        ips: [],
        method: 'POST',
        url: '/graphql',
        headers: {},
      },
      res: {
        header: () => undefined,
        setHeader: () => undefined,
        status: () => ({ send: () => undefined }),
      },
    };
  }
}
