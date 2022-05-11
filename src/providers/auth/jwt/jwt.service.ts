import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtConfigService } from '../../../configs/auth/jwt/config.service'

@Injectable()
export class JwtAuthService {
    constructor(
                private readonly jwtService: JwtService,
                private readonly jwtConfigService: JwtConfigService
    ) {}
    public async getCookieWithJwtAccessToken(userId: number, isSecondFactorAuth = false) {
        const accessToken = await this.jwtService.signAsync(
            { userId, isSecondFactorAuth},
            {
                secret: this.jwtConfigService.accessSecret,
                expiresIn: `${this.jwtConfigService.accessExpiresIn}s`,
            }
        )
        return `Access=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${this.jwtConfigService.accessExpiresIn}`
    }
    public async getCookieWithJwtRefreshToken(userId: number) {
        const refreshToken = await this.jwtService.signAsync(
            { userId },
            {
                secret: this.jwtConfigService.refreshSecret,
                expiresIn: `${this.jwtConfigService.refreshExpiresIn}s`,
            }
        )
        const refreshCookie = `Refresh=${refreshToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${this.jwtConfigService.refreshExpiresIn}`
        return {
            refreshCookie,
            refreshToken,
        }
    }
    public async getVerificationToken(email: string) {
        return await this.jwtService.signAsync(
            { email },
            {
                secret: this.jwtConfigService.verificationSecret,
                expiresIn: `${this.jwtConfigService.verificationExpiresIn}s`,
            }
        )
    }
    public async decodeConfirmationToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token, { secret: this.jwtConfigService.verificationSecret })
            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email
            }
            throw new BadRequestException()
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException('Email confirmation token expired')
            }
            throw new BadRequestException('Bad confirmation token')
        }
    }
}
