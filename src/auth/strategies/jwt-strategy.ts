import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService

    ) {


        super({
            secretOrkey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }



    async validate(payload: JwtPayload): Promise<User> {

        const { email } = payload;

        const user = await this.userRepository.findOneBy({ email });

        if (!user)
            throw new UnauthorizedException('Token not valid')

        if (!user.isActive)
            throw new UnauthorizedException('user is inactive, talk with an admin');



        return user;

    }


} 