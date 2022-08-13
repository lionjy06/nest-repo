import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  NotFoundException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';

import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

import { CurrentUser, ICurrentUser } from './rest.params';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAccessGuard, JwtRefreshGuard } from './jwt.auth';
import { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';
interface IOauthUser {
  user: Pick<User, 'email' | 'password' | 'age' | 'name'>;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async combine(req, res) {
    let user = await this.usersService.findUserByEmail({
      email: req.user.email,
    });

    if (!user) {
      const { password, ...rest } = req.user;
      const createUser = { ...rest, hashedPassword: password };

      user = await this.usersService.createUser({ ...createUser });
    }
    console.log(user);
  }

  @ApiQuery({ name: 'userId', required: true })
  @Post('test')
  async valid(@Query('userId') userId: string) {
    const user = await this.usersService.findUserById({ userId });
    return await this.authService.getAccessToken({ user });
  }

  @ApiResponse({ status: 201, description: '로그인 로직' })
  @ApiBody({ type: Object, required: true })
  @Post('login')
  async login(
    @Body('password') password: string,
    @Body('email') email: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findUserByEmail({ email });
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

  @ApiBody({ type: Object, required: true })
  @ApiResponse({
    description: 'refreshToken이 살아있다면 accessToken재발급 가능',
  })
  @UseGuards(JwtRefreshGuard)
  @Post('restore')
  async restoreToken(@Body('email') email: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findUserByEmail({ email });
      const token = await this.authService.getAccessToken({ user });
      return res.status(201).json({
        token,
        status: 'ok',
        statusCode: 201,
      });
    } catch (e) {
      return res.status(400).json({
        status: 'fail',
        statusCode: 400,
        message: e,
      });
    }
  }

  async socialLogin(req, res) {
    const user = await this.usersService.findUserByEmail({
      email: req.user.email,
    });

    const { name, age, email, password, phoneNumber } = req.user;
    if (user) {
      const access = await this.authService.getAccessToken({ user });
      const refresh = this.authService.getRefreshToken({ user, res });
      await res.redirect('http://127.0.0.1:5500/src/frontend/login/index.html');
    } else {
      const hashedPassword = await bcrypt.hash(String(password), 5);

      const user = await this.usersService.createUser({
        email,
        name,
        hashedPassword,
        age,
        phoneNumber,
      });

      const access = await this.authService.getAccessToken({ user });
      const refresh = this.authService.getRefreshToken({ user, res });
      await this.mailService.sendMail(email, name);
      await res.redirect('http://127.0.0.1:5500/src/frontend/login/index.html');
    }
  }

  @Get('login/naver/callback')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(@Req() req: Request & IOauthUser, @Res() res: Response) {
    try {
      return this.socialLogin(req, res);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('login/google/callback')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() req: Request & IOauthUser, @Res() res: Response) {
    try {
      return this.socialLogin(req, res);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('login/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: Request & IOauthUser, @Res() res: Response) {
    try {
      return this.socialLogin(req, res);
    } catch (e) {
      console.log(e);
    }
  }

  @UseGuards(JwtAccessGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout({ req, res });
    return res.status(200).json({
      status: 200,
      statusName: 'logged out',
    });
  }
}
