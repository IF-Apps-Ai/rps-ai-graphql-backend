import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const token = request.headers.authorization?.split(' ')[1];
    // console.log('GqlAuthGuard token = ', token);

    if (!token) {
      throw new Error('Authentication token is missing');
    }

    try {
      const payload = verify(token, process.env.JWT_SECRET);
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error('Token expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Authentication failed');
    }
  }
}
