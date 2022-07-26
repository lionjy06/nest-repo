import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class jwtAccess extends PassportStrategy(Strategy, 'access'){
  constructor(){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:'brad000',
      passReqToCallback:true
    })
  }

  async validate(req, payload){
    console.log(`req:${req}`)
    console.log(`payload:${payload}`)
  }
}
