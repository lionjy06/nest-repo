import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { NotFoundError } from 'rxjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CurrentUser, ICurrentUser } from './rest.params';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiQuery({ name: 'userId', required: true })
  @Post('test')
  async valid(@Query('userId') userId: string) {
    const user = await this.usersService.findUserById({ userId });
    return await this.authService.getAccessToken({ user });
  }

  @Post('login')
  async login(
    @Body('password') password: string,
    @Body('email') userEmail: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findUserByEmail({ userEmail });
    if (!user) throw new NotFoundException('유저를 찾을수 없습니다');

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new NotFoundException('비밀번호가 옳지 안습니다.');

    this.authService.getRefreshToken({
      user,
      res,
    });

    const token = await this.authService.getAccessToken({ user });

    res.status(201).json({
      token,
      status: 'ok',
      statuscode: 201,
    });
  }
}
