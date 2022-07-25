import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save({ ...createUserDto });
    console.log(user);
    return user;
  }

  async findUserById({ userId }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['name', 'id'],
    });
    if (!user) throw new NotFoundException('해당하는 유저가 없습니다.');
    return user;
  }

  async findAllUser(limit) {
    const take = limit ? limit : 4;
    console.log(typeof take);
    const user = await this.userRepository.find({
      select: ['id', 'email', 'name'],
      take,
      //take = limit
    });

    console.log(user);
    return user;
  }
}
