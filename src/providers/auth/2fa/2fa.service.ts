import { Injectable, UnauthorizedException } from '@nestjs/common'
import { authenticator } from 'otplib'
import User from '../../../models/user/entity/user.entity'
import { UserService } from '../../../models/user/user.service'
import { TFAConfigService } from '../../../configs/auth/2fa/config.service'
import { toFileStream } from 'qrcode'
import { Response, Request } from 'express'
import { JwtAuthService } from '../jwt/jwt.service'

@Injectable()
export class TwoFactorAuthService {
    constructor(
            private readonly userService: UserService,
            private readonly TwoFactorConfigService: TFAConfigService,
            private readonly jwtAuthService: JwtAuthService
    ) {}

    public async generateTwoFactorQr(user: User, res: Response){
        const { otpauthUrl } = await this.generateTwoFactorAuthSecret(user)
        return this.pipeQrCodeStream(res, otpauthUrl)
    }
    
   public async turnOnTwoFactorAuth(user: User, twoFactorAuthCode: string, req: Request){
       const isCodeValid = this.isTwoFactorAuthCodeValid(twoFactorAuthCode, user)
       if (!isCodeValid) {
           throw new UnauthorizedException('Wrong authentication code')
       }
       if (!user.isTwoFactorAuthEnabled){
           await this.userService.turnOnTwoFactorAuth(user.id)
       }
       const accessTokenCookie = await this.jwtAuthService.getCookieWithJwtAccessToken(user.id, true)
       const { refreshCookie, refreshToken } = await this.jwtAuthService.getCookieWithJwtRefreshToken(user.id)
       await this.userService.setCurrentRefreshToken(refreshToken, user.id)
       req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshCookie])
   }

    public async generateTwoFactorAuthSecret(user: User) {
        const secret = authenticator.generateSecret()
        const otpauthUrl = authenticator.keyuri(user.email, this.TwoFactorConfigService.appName, secret)
        await this.userService.setTwoFactorAuthSecret(secret, user.id)
        return {
            secret,
            otpauthUrl,
        }
    }

    public isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
        return authenticator.verify({
            token: twoFactorAuthCode,
            secret: user.twoFactorAuthSecret!,
        })
    }

    public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl)
    }
}
