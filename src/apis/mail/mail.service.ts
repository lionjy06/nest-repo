import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';


@Injectable()
export class MailService {
  constructor(
    private readonly mailerService:MailerService
  ){}
  
  async sendMail(email,name){
    try {
      
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: 'jyjjyj06@gmail.com', // sender address
        subject: `${name}님 가입을 축하드립니다.`, // Subject line
        html: `${name}님 가입을 축하드립니다! 앞으로 최선의 서비스로 모시겠습니다.`
      });
      return '이메일 발송 성공';
    } catch (err) {
      console.log(err);
      return false
    }
  }
}
