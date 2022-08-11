import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({ description: 'token 만들기' })
  @Post('token')
  async sendSMS(@Body('phoneNumber') phoneNumber: string) {
    const token = String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
    const SMS = await this.usersService.sendSMS(phoneNumber, token);
    return '인증번호 발급완료';
  }

  @ApiBody({ required: true })
  @Post('valid')
  async validToken(
    @Body('token') token: string,
    @Body('phoneNumber') phoneNumber: string,
  ) {
    return await this.usersService.validToken(phoneNumber, token);
  }

  @ApiResponse({ type: User })
  @ApiBody({ type: Object, required: true })
  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const { password, phoneNumber, ...rest } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 5);
    await this.usersService.createUser({
      ...rest,
      hashedPassword,
      phoneNumber,
    });
    return response.status(201).json({
      status: 200,
      statusName: '회원가입이 성공적으로 완료되었습니다.',
    });
  }

  @ApiResponse({ type: User, isArray: true })
  @ApiQuery({ required: false, name: 'skip' })
  @ApiQuery({ required: false, name: 'take' })
  @Get('find')
  async findAllUser(
    @Query('take', ParseIntPipe) limit: number,
    @Query('skip', ParseIntPipe) page: number,
  ): Promise<User[]> {
    // console.log(typeof skip);
    const user = await this.usersService.findAllUser({ limit, page });

    return user;
  }

  @ApiResponse({ type: User })
  @ApiParam({ name: 'id' })
  @Get(':id')
  async findUserById(@Param('id') userId: string): Promise<User> {
    const user = await this.usersService.findUserById({ userId });
    return user;
  }

  @Get('findEmail')
  @ApiResponse({ status: 200 })
  @ApiBody({ type: String })
  async findUserByEmail(@Body('email') email: string) {
    const user = await this.usersService.findUserByEmail({ email });
  }
}
