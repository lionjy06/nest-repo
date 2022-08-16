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
      { email: user.email, sub: user.id },
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
    console.log(req.headers)
    const refreshToken = req.headers.cookie.split('refreshToken=')[1];
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    console.log(`this is refreshToken in logout ${refreshToken}`)
    console.log(`this is access in logout ${accessToken}`)
    let access;
    let refresh;
    try {
      access = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      refresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (e) {
      console.log(e);
    }

    await this.cacheManager.set(`refreshToken:${refreshToken}`, refreshToken, {
      ttl: Math.floor((refresh.exp / 1000) % 60),
    });

    await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
      ttl: Math.floor((access.exp / 1000) % 60),
    });

    return 'logging out complete';
  }
}
