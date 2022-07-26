import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService{
    constructor(
        private readonly jwtService:JwtService,
    ){}

    async getAccessToken({user}){
        return this.jwtService.sign(
            {name:user.name, sub:user.id},
            {secret:'brad000', expiresIn:"30s"}
        )
    }
}