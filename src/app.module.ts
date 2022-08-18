import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './apis/users/users.module';
import { ProductsModule } from './apis/products/products.module';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodosModule } from './apis/todos/todos.module';
import { ContactModule } from './apis/contact/contact.module';
import { OrderModule } from './apis/order/order.module';
import { MeetingModule } from './apis/meeting/meeting.module';
import { AuthModule } from './apis/auth/auth.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { UploadModule } from './apis/upload/upload.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './apis/mail/mail.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: process.env.NODE_ENV === 'production',
      dropSchema: false,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_ADDRESS,
      isGlobal: true,
    }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        }
      }),
      inject: [ConfigService],
    }),
    TodosModule,
    ContactModule,
    OrderModule,
    MeetingModule,
    AuthModule,
    UploadModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ElasticsearchModule]
})
export class AppModule {}
