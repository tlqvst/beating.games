import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  isPublic: boolean = false;
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Do not error on public endpoints where we still need user info
   * e.g. user status endpoint
   */
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (this.isPublic) return user;

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }

  canActivate(context: ExecutionContext) {
    const isPublicEndpoint = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublicEndpoint) {
      this.isPublic = true;
    }
    return super.canActivate(context);
  }
}
