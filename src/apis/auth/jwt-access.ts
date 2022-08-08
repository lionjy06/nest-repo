import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Cache } from 'cache-manager';


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

    if (token) throw new NotAcceptableException('로그아웃 되었습니다.');
    return {
      id: req.sub,
      email: req.email,
    };
  }
}
