import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import User from '../../../models/user/entity/user.entity'
import { Repository } from 'typeorm'
import { JwtConfigService } from '../../../configs/auth/jwt/config.service'
import { TokenPayload } from '../2fa/types/TokenPayload'

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt2fa') {
    constructor(
        private readonly jwtConfigService: JwtConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Access
                },
            ]),
            secretOrKey: jwtConfigService.accessSecret,
        })
    }

    async validate(payload: TokenPayload) {
        const user = await this.userRepository.findOne ( { id: payload.userId } )
        if (user && user.isTwoFactorAuthEnabled && payload?.isSecondFactorAuth) {
            return user
        }
        else throw new UnauthorizedException('User do not exist')
    }

}
