import { CACHE_MANAGER, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';


@Injectable()
export class jwtRefresh extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookies = req.headers.cookie;

        return cookies.replace('refreshToken=', '');
      },
      secretOrKey: process.env.REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(payload: any, req) {
    const refreshToken = req.headers.cookie.split('refreshToken=')[1];
    const token = await this.cacheManager.get(`refreshToken:${refreshToken}`);

    if (token) throw new NotAcceptableException('로그인 되었습니다.');

    return {
      id: req.sub,
      email: req.email,
    };
  }
}
