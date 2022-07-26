import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService:UsersService,
    private readonly authService:AuthService
    ) {}

  @Post('test')
  async valid(
    @Query('userId') userId:string
  ){
    const user = await this.usersService.findUserById({userId})
    return await this.authService.getAccessToken({user})
  }
}
