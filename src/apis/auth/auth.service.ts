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
    return this.jwtService.sign(
      { name: user.name, sub: user.id },
      { secret: 'brad000', expiresIn: '30s' },
    );
  }

  async getRefreshToken({ user, res }: UserInterface) {
    const refreshToken = await this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'brad000', expiresIn: '1h' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`)
    
  }
}
