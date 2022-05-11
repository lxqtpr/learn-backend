import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { JwtConfigService } from '../../../configs/auth/jwt/config.service'
import User from '../../../models/user/entity/user.entity'
import { Request } from 'express'

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwtAccess') {
    constructor(
        private readonly jwtConfigService: JwtConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.Access
                },
            ]),
            secretOrKey: jwtConfigService.accessSecret,
        })
    }

    async validate(payload): Promise<User> {
        return this.userRepository.findOne(payload.userId)
    }
}
