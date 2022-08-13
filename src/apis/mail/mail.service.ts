import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email, name) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      transporter.sendMail({
        to: email,
        from: 'jyjjyj06@gmail.com',
        subject: `${name}님 가입을 축하드립니다.`,
        html: `${name}님 가입을 축하드립니다! 앞으로 최선의 서비스로 모시겠습니다.`,
      });
      return '이메일 발송 성공';
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
