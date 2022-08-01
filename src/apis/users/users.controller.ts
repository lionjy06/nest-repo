import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
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
import { JwtRefreshGuard } from '../auth/jwt.auth';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: User })
  @ApiBody({ type: Object, required: true })
  @Post('create')
  async createUser(
    @Body('name') name: string,
    @Body('age') age: number,
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response,
    // @Body() createUserDto: CreateUserDto,
  ) {
    const hashedPassword = await bcrypt.hash(password, 5);
    await this.usersService.createUser({
      name,
      age,
      email,
      hashedPassword,
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
  async findUserByEmail(@Body('email') userEmail: string) {
    const user = await this.usersService.findUserByEmail({ userEmail });
  }
}
