import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthService } from './jwt.service'
import { JwtConfigModule } from '../../../configs/auth/jwt/config.module'

@Module({
    imports: [JwtConfigModule, JwtModule.registerAsync({ useFactory: async () => ({}) })],
    providers: [JwtAuthService],
    exports: [JwtAuthService, JwtConfigModule],
})
export class JwtProviderModule {}
