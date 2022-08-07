import { CACHE_MANAGER, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { jwtAccess } from './jwt-access';
import { jwtRefresh } from './jwt-refresh';
import { KakaoStrategy } from './jwt-kakao';
import { NaverStrategy } from './jwt-naver';
import { GoogleStrategy } from './jwt-google';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    jwtAccess,
    jwtRefresh,
    KakaoStrategy,
    GoogleStrategy,
    NaverStrategy,
  ],
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
