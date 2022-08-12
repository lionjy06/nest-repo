import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule} from '@nestjs-modules/mailer';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports:[
    MailerModule.forRoot({
      transports:{
        service: 'gmail',
        host: 'smtp.gmail.email',
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }
    })
  ]
})
export class MailModule {}
