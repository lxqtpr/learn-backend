import { Module } from '@nestjs/common'
import { TwoFactorAuthService } from './2fa.service'
import { TFAConfigModule } from '../../../configs/auth/2fa/config.module'
import { TwoFactorAuthController } from './2fa.controller'
import { UserModule } from '../../../models/user/user.module'
import { JwtProviderModule } from '../jwt/jwt.module'

@Module({
    imports: [TFAConfigModule, UserModule, JwtProviderModule],
    controllers: [TwoFactorAuthController],
    providers: [TwoFactorAuthService],
    exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
