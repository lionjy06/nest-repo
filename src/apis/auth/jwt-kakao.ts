import { PassportStrategy } from "@nestjs/passport";
import { Strategy,Profile } from "passport-kakao";



export class KakaoStrategy extends PassportStrategy(Strategy,'kakao'){
    constructor(){
        super({
            clientID:process.env.KAKAO_CLIENT_ID,
            callbackURL:process.env.KAKAO_CALLBACK_URL,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            scope: ['profile_image', 'account_email'],
        })
    }

    async validate(accessToken:string, refreshToken:string, profile:Profile){
        console.log(`this is profile info: ${profile}`)
        return {
            email:profile._json
        }
    }
}