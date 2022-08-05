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

  async validate(payload: any, req) {
    const accesstoken = payload.headers.authorization.replace('Bearer ', '');
    const token = await this.cacheManager.get(`accessToken:${accesstoken}`);
    console.log(req)
    if (token) throw new NotAcceptableException('로그아웃 되었습니다.');
    return {
      id: req.sub,
      email: req.email,
    };
  }
}
