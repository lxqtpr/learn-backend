import { Module } from '@nestjs/common'
import { GoogleAuthController } from './google.controller'
import { UserModule } from '../../../models/user/user.module'
import { JwtProviderModule } from '../jwt/jwt.module'
import { GoogleConfigModule } from '../../../configs/auth/google/config.module'
import { GoogleAuthService } from './google.service'
import {GoogleStrategy} from '../strategies/google.strategy'

@Module({
    imports: [UserModule, JwtProviderModule, GoogleConfigModule, GoogleStrategy],
    providers: [GoogleAuthService],
    controllers: [GoogleAuthController]
})

export class GoogleAuthModule{}