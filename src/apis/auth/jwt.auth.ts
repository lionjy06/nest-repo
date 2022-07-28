import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtAccessGuard extends AuthGuard('access') {
    getRequest(ctx: ExecutionContext) {
        const request = ctx.switchToHttp().getRequest();
        console.log(request)
        return request.user;
      }
}

