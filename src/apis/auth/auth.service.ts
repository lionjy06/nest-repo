import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { Cache } from 'cache-manager';
import * as jwt from 'jsonwebtoken';
interface UserInterface {
  user: any;
  res: Response;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getAccessToken({ user }) {
    const accessToken = this.jwtService.sign(
      { name: user.name, sub: user.id },
      { secret: process.env.ACCESS_SECRET, expiresIn: '10m' },
    );
    return accessToken;
  }

  async getRefreshToken({ user, res }: UserInterface) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_SECRET, expiresIn: '1h' },
    );

    res.setHeader(`Set-Cookie`, `refreshToken=${refreshToken}`);
  }

  async logout({ req, res }) {
    const refreshToken = req.headers.cookie.split('refreshToken=')[1];
    const accessToken = req.headers.authorization.replace('Bearer ', '');

    let access;
    let refresh;
    try {
      access = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      refresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (e) {
      console.log(e);
    }
    console.log('1');

    await this.cacheManager.set(
      `refreshToken:${refreshToken}`,
      `refreshToken`,
      { ttl: refresh.exp },
    );
    console.log('2');

    await this.cacheManager.set(`accessToken:${accessToken}`, `accessToken`, {
      ttl: access.exp,
    });

    console.log('aa');
  }
}
