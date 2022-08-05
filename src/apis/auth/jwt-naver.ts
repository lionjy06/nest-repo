import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-naver";

@Injectable()
export class NaverStrategy extends PassportStrategy (Strategy, 'naver') {
    constructor(){
        super({
            clientID: process.env.NAVER_CLINET_ID,
            clientSecret:process.env.NAVER_CLIENT_SECRET,
            callbackURL:process.env.NAVER_CALLBACK_URL,
            scope: ['email','name']
        })
    }
    async validate(accessToken:string, refreshToken:string, profile:Profile){
        console.log(profile)
    }
}