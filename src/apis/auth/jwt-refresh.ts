import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';


export class jwtRefresh extends PassportStrategy(Strategy,'refresh'){
    constructor(){
        super({
            jwtFromRequest: (req) => {
                const cookies = req.headers.cookie;

                return cookies.replace('refreshTokn=','')
            },
            secretOrKey: 'brad000',
            passReqToCallback:true,
        })
    }

    async validator(req,payload){}
}