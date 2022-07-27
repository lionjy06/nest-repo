import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: User })
  @Post('create')
  async createUser(
    @Body('name') name: string,
    @Body('age') age: number,
    @Body('email') email: string,
    @Body('password') password:string
    // @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password,5)
    return await this.usersService.createUser({name,age,email,hashedPassword});
  }

  @ApiResponse({ type: User, isArray: true })
  @ApiQuery({ required: false, name: 'skip' })
  @ApiQuery({ required: false, name: 'take' })
  @Get('find')
  async findAllUser(
    @Query('take', ParseIntPipe) limit: number,
  ): Promise<User[]> {
    // console.log(typeof skip);
    const user = await this.usersService.findAllUser(limit);

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
  async findUserByEmail(
    @Body('email') userEmail:string
  ){
      const user = await this.usersService.findUserByEmail({userEmail})
  }
}
