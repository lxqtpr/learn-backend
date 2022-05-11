import { Module } from '@nestjs/common'
import EmailService from './email.service'
import { EmailConfigModule } from '../../../configs/auth/email/config.module'
import { JwtProviderModule } from '../../../providers/auth/jwt/jwt.module'

@Module({
    imports: [EmailConfigModule, JwtProviderModule],
    providers: [EmailService],
    exports: [EmailService, EmailConfigModule],
})
export class EmailModule {}
