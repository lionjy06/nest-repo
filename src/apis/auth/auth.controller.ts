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
  HttpCode,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { NotFoundError } from 'rxjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CurrentUser, ICurrentUser } from './rest.params';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { IKAKAO } from './jwt-kakao';
import { JwtRefreshGuard } from './jwt.auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async combine(req, res) {
    let user = await this.usersService.findUserByEmail({ email: req.user.email });

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

  @ApiBody({type:Object, required:true})
  @ApiResponse({description:"refreshToken이 살아있다면 accessToken재발급 가능"})
  @UseGuards(JwtRefreshGuard)
  @Post('restore')
  async restoreToken(
    @Body('email') email:string,
    @Res() res:Response
  ){
    try{
      const user = await this.usersService.findUserByEmail({ email });
      const token = await this.authService.getAccessToken({user})
      return res.status(201).json({
        token,
        status: 'ok',
        statusCode: 201,
      });
    } catch(e) {
      return res.status(400).json({
        status:'fail',
        statusCode: 400,
        message:e
      })
    }
   
  }
  // @Get('/login/kakao')
  // @UseGuards(AuthGuard('kakao'))
  // async loginKakao(@Req() req: Request & IOauthUser, @Res() res: Response) {
  //   let user = this.combine(req, res);
  //   this.authService.getRefreshToken({ user, res });
  //   res.redirect(
  //     'http://localhost:5500/main-project/frontend/login/index.html',
  //   );
  // }
}
