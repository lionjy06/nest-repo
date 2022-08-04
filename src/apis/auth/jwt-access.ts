import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotAcceptableException,
  Req,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { Request } from 'express';
@Injectable()
export class jwtAccess extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(payload: any, req: Request) {
    const accesstoken = payload.headers.authorization.replace('Bearer ', '');
    const check = await this.cacheManager.get(`accesstoken:${accesstoken}`);
    if (check) throw new NotAcceptableException('로그인 되었습니다.');
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
