import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { async } from 'rxjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [MailService],
})
export class MailModule {}
