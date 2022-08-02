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

  async createUser({ hashedPassword,...rest}) {
    const password = hashedPassword;
    const user = await this.userRepository.create({
      ...rest,
      password
    });
    return await this.userRepository.save(user);
  }

  async findUserById({ userId }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    console.log(user);
    if (!user) throw new NotFoundException('해당하는 유저가 없습니다.');
    return user;
  }

  async findAllUser({ limit, page }) {
    const take = limit ? limit : 4;
    const skip = page ? (page - 1) * 12 : 0;
    console.log(typeof take);
    const user = await this.userRepository.find({
      select: ['id', 'email', 'name'],
      take,
      //take = limit
      skip,
      //skip = offset
    });

    console.log(user);
    return user;
  }

  async findUserByEmail({ email }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }
}
