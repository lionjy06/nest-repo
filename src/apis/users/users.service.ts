import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { getRepository, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs';
import schema from './car.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly config: ConfigService,

    private readonly mailService: MailService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private makeSMS(now: string) {
    const accessKey = process.env.NCP_ACCESS_KEY;
    const secretKey = process.env.NCP_SECRET_KEY;
    const uri = process.env.NCP_PROJECT_ID;
    const message = [];
    const hmac = crypto.createHmac('sha256', secretKey);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const url = `/sms/v2/services/${uri}/messages`;
    const timestamp = now;
    message.push(method);
    message.push(space);
    message.push(url);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(accessKey);
    //message 배열에 위의 내용들을 담아준 후에
    const signature = hmac.update(message.join('')).digest('base64');
    //message.join('') 으로 만들어진 string 을 hmac 에 담고, base64로 인코딩한다
    return signature.toString();
  }

  async sendSMS(phoneNumber: string, token: string): Promise<string> {
    const now = Date.now().toString();
    const body = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: process.env.NCP_MYNUM, // 발신자 번호
      content: `라이즈의 인증번호는 ${token}입니다.`,
      messages: [
        {
          to: phoneNumber, // 수신자 번호
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY,
      'x-ncp-apigw-timestamp': now,
      'x-ncp-apigw-signature-v2': this.makeSMS(now),
    };

    await axios
      .post(
        `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NCP_PROJECT_ID}/messages`,
        body,
        { headers },
      )
      .then(async (res) => {
        console.log('SMS발송에 성공하였습니다.');
      })
      .catch((err) => {
        console.log('SMS발송에 실패하였습니다.');
        console.error(err + ' 발생했습니다.');
      });

    await this.cacheManager.set(phoneNumber, token, { ttl: 120 });
    return token;
  }

  async validToken(phoneNumber, token) {
    const validation = await this.cacheManager.get(`${phoneNumber}`);

    if (token === validation) {
      await this.cacheManager.del(phoneNumber);
      return true;
    } else if (!validation) return '인증번호를 재발급 받아주세요';
    else if (token !== validation) return '올바른 인증 번호를 보내주세요';
  }

  async createUser({ hashedPassword, phoneNumber, name, email, ...rest }) {
    const password = hashedPassword;
    const user = await this.userRepository.create({
      email,
      password,
      phoneNumber,
      name,
      ...rest,
    });
    await this.mailService.sendMail(email, name);
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

  async findUserName({ userName, limit }) {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.product', 'product')
      .where('user.name = :name', { name: userName })
      .limit(+limit)
      .getMany();
  }

  private schemaValid(now: string) {
    const accessKey = process.env.NCP_ACCESS_KEY;
    const secretKey = process.env.NCP_SECRET_KEY;
    const url = '/CloudSearch/real/v1/schemaValidator';
    const message = [];
    const hmac = crypto.createHmac('sha256', secretKey);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const timestamp = now;
    message.push(method);
    message.push(space);
    message.push(url);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(accessKey);

    const signature = hmac.update(message.join('')).digest('base64');

    return signature.toString();
  }

  async schemaConfirm() {
    const body = schema;
    const now = Date.now().toString();
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY,
      'x-ncp-apigw-timestamp': now,
      'x-ncp-apigw-signature-v2': this.schemaValid(now),
      Host: 'cloudsearch.apigw.ntruss.com',
    };

    await axios.post(
      'https://cloudsearch.apigw.ntruss.com/CloudSearch/real/v1/schemaValidator',
      body,
      { headers },
    );
    return 'success';
  }

  private domainInfo(now: string) {
    const accessKey = process.env.NCP_ACCESS_KEY;
    const secretKey = process.env.NCP_SECRET_KEY;
    const url = '/CloudSearch/real/v1/domain';
    const message = [];
    const hmac = crypto.createHmac('sha256', secretKey);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const timestamp = now;
    message.push(method);
    message.push(space);
    message.push(url);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(accessKey);
    const signature = hmac.update(message.join('')).digest('base64');

    return signature.toString();
  }

  async makeDomain() {
    const now = Date.now().toString();
    const schemaForm = schema;
    const body = {
      name: process.env.NCP_CLOUDSEARCH_DOMAIN,
      description: 'cloud search test 8',
      type: 'small',
      indexerCount: 1,
      searcherCount: 1,
      schema: schemaForm,
    };

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY,
      'x-ncp-apigw-timestamp': now,
      'x-ncp-apigw-signature-v2': this.domainInfo(now),
      Host: 'cloudsearch.apigw.ntruss.com',
    };

    await axios.post(
      `https://cloudsearch.apigw.ntruss.com/CloudSearch/real/v1/domain`,
      body,
      { headers },
    );
  }

  private documentAPI(now: string) {
    const accessKey = process.env.NCP_ACCESS_KEY;
    const secretKey = process.env.NCP_SECRET_KEY;
    const url = `/CloudSearch/real/v1/domain/${process.env.NCP_CLOUDSEARCH_DOMAIN}/document/search`;
    const message = [];
    const hmac = crypto.createHmac('sha256', secretKey);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const timestamp = now;
    message.push(method);
    message.push(space);
    message.push(url);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(accessKey);

    const signature = hmac.update(message.join('')).digest('base64');

    return signature.toString();
  }

  async searchDocument({ name }) {
    const now = Date.now().toString();
    const body = {
      start: 1,
      display: 20,
      search: {
        content_indexer: {
          main: {
            query: name,
            option: 'or',
          },
        },
      },
    };

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-signature-v2': this.documentAPI(now),
      'x-ncp-apigw-timestamp': now,
      'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY,
    };

    await axios
      .post(
        `https://cloudsearch.apigw.ntruss.com/CloudSearch/real/v1/domain/${process.env.NCP_CLOUDSEARCH_DOMAIN}/document/search`,
        body,
        { headers },
      )
      .then((res) => console.log(JSON.stringify(res.data)))
      .catch((err) => {
        console.log(err + ' 발생했습니다.');
      });
  }

  private schemaCheck(now: string) {
    const accessKey = process.env.NCP_ACCESS_KEY;
    const secretKey = process.env.NCP_SECRET_KEY;
    const url = `/CloudSearch/real/v1/domain/${process.env.NCP_CLOUDSEARCH_DOMAIN}/schema`;
    const message = [];
    const hmac = crypto.createHmac('sha256', secretKey);
    const space = ' ';
    const newLine = '\n';
    const method = 'GET';
    const timestamp = now;
    message.push(method);
    message.push(space);
    message.push(url);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(accessKey);

    const signature = hmac.update(message.join('')).digest('base64');

    return signature.toString();
  }

  async getSchema() {
    const now = Date.now().toString();
    const headers = {
      Host: 'cloudsearch.apigw.ntruss.com',

      'x-ncp-apigw-signature-v2': this.schemaCheck(now),
      'x-ncp-apigw-timestamp': now,
      'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY,
    };

    const result = await axios
      .get(
        `https://cloudsearch.apigw.ntruss.com/CloudSearch/real/v1/domain/${process.env.NCP_CLOUDSEARCH_DOMAIN}/schema`,
        { headers },
      )
      .then(async (res) =>
        console.log(JSON.stringify(res.data) + ' 성공했습니다.'),
      )
      .catch((err) => console.log(err + ' 발생했습니다.'));

    return '성공했습니다';
  }

  async documentInsert({ brand, name, color, price, type }) {
    const body = {
      requests: [
        {
          type: 'insert',
          content: {
            docid: crypto.randomUUID(),
            brand: brand,
            name: name,
            color: color,
            price: price,
            type: type,
          },
        },
      ],
    };
    const now = new Date().toString();
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY,
      'x-ncp-apigw-timestamp': now,
      'x-ncp-apigw-signature-v2': this.documentAPI(now),
      Host: 'cloudsearch.apigw.ntruss.com',
    };

    await axios.post(
      `https://cloudsearch.apigw.ntruss.com/CloudSearch/real/v1/domain/${process.env.NCP_CLOUDSEARCH_DOMAIN}/document/manage`,
      body,
      { headers },
    );
  }

  async documentUpsert({ brand, name, color, price, type }) {
    const body = {
      requests: [
        {
          type: 'insert',
          content: {
            docid: crypto.randomUUID(),
            brand: brand,
            name: name,
            color: color,
            price: price,
            type: type,
          },
        },
      ],
    };
    const now = new Date().toString();
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY,
      'x-ncp-apigw-timestamp': now,
      'x-ncp-apigw-signature-v2': this.documentAPI(now),
      Host: 'cloudsearch.apigw.ntruss.com',
    };

    await axios.post(
      `https://cloudsearch.apigw.ntruss.com/CloudSearch/real/v1/domain/${process.env.NCP_CLOUDSEARCH_DOMAIN}/document/manage`,
      body,
      { headers },
    );
  }
}
