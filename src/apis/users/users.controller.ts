import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { MailService } from '../mail/mail.service';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @ApiBody({ description: 'token 만들기' })
  @Post('token')
  async sendSMS(@Body('phoneNumber') phoneNumber: string) {
    const token = String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
    const SMS = await this.usersService.sendSMS(phoneNumber, token);
    return '인증번호 발급완료';
  }

  @ApiBody({ required: true })
  @Post('tokenValid')
  async validToken(
    @Body('token') token: string,
    @Body('phoneNumber') phoneNumber: string,
  ) {
    return await this.usersService.validToken(phoneNumber, token);
  }

  @Get('getSchema')
  async getSchema() {
    return await this.usersService.getSchema();
  }

  @Post('schemaConfirm')
  async schema() {
    return this.usersService.schemaConfirm();
  }

  @Post('domain')
  async makeDomain() {
    return await this.usersService.makeDomain();
  }

  @Post('search')
  async searchDocument(@Body('name') name: string) {
    return await this.usersService.searchDocument({ name });
  }

  @Post('documentInsert')
  async documentInsert(
    @Body('brand') brand: string,
    @Body('name') name: string,
    @Body('color') color: string,
    @Body('price') price: string,
    @Body('type') type: string,
  ) {
    return await this.usersService.documentInsert({
      brand,
      name,
      color,
      price,
      type,
    });
  }

  @Put('schemaChange')
  async schemaChange(){
    return await this.usersService.schemaAlter()
  }

  @ApiResponse({ type: User })
  @ApiBody({ type: Object, required: true })
  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const { password, phoneNumber, name, email, ...rest } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 5);
    await this.usersService.createUser({
      ...rest,
      hashedPassword,
      phoneNumber,
      name,
      email,
    });

    return response.status(201).json({
      status: 200,
      statusName: '회원가입이 성공적으로 완료되었습니다.',
    });
  }

  @ApiQuery({ required: false, name: 'limit' })
  @ApiQuery({ required: true, name: 'name' })
  @Get('searchName')
  async findUserName(
    @Query('name') userName: string,
    @Query('limit') limitNum?: number,
  ) {
    const limit = limitNum ? limitNum : 4;
    return this.usersService.findUserName({ userName, limit });
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

  @Get('findEmail')
  @ApiResponse({ status: 200 })
  @ApiBody({ type: String })
  async findUserByEmail(@Body('email') email: string) {
    const user = await this.usersService.findUserByEmail({ email });
  }

  @ApiResponse({ type: User })
  @ApiParam({ name: 'id' })
  @Get(':id')
  async findUserById(@Param('id') userId: string): Promise<User> {
    const user = await this.usersService.findUserById({ userId });
    return user;
  }
}
