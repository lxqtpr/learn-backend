import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

import { JwtProviderModule } from './jwt/jwt.module'
import { UserModule } from '../../models/user/user.module'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtAccessStrategy } from './strategies/jwtAccess.strategy'
import { JwtRefreshStrategy } from './strategies/jwtRefresh.strategy'
import { EmailModule } from '../../core/services/email/email.module'
import { TwoFactorAuthModule } from './2fa/2fa.module'
import { JwtTwoFactorStrategy } from './strategies/2fa.strategy'
import { GoogleAuthModule } from './google/google.module'

@Module({
    imports: [JwtProviderModule, UserModule, EmailModule, TwoFactorAuthModule, GoogleAuthModule],
    providers: [AuthService, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy, JwtTwoFactorStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
