import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

interface UserInterface {
  user: any;
  res: Response;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getAccessToken({ user }) {
    const accessToken = this.jwtService.sign(
      { name: user.name, sub: user.id },
      { secret: 'brad000', expiresIn: '45s' },
    );
    return accessToken;
  }

  async getRefreshToken({ user, res }: UserInterface) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'brad000', expiresIn: '1h' },
    );
    console.log(`this is refresh:${refreshToken}`);
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
    res.cookie('refreshToken', `${refreshToken}`, {
      domain: 'http://localhost:3000',
      path: '/',
    });
  }
}
