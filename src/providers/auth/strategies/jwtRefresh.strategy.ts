import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Logger } from '@nestjs/common'
import { Request } from 'express'
import { JwtConfigService } from '../../../configs/auth/jwt/config.service'
import { UserService } from '../../../models/user/user.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwtRefresh') {
    constructor(private readonly jwtConfigService: JwtConfigService, private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.Refresh
                },
            ]),
            secretOrKey: jwtConfigService.refreshSecret,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, payload) {
        const refreshToken = req.cookies?.Refresh
        return this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId)
    }
}
