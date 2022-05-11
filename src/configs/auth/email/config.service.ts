import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EmailConfigService {
    constructor(private readonly configService: ConfigService) {}

    get emailService(): string {
        return String(this.configService.get<string>(`email.emailService`))
    }
    get emailUser(): string {
        return String(this.configService.get<string>(`email.emailUser`))
    }
    get emailPassword(): string {
        return this.configService.get<string>('email.emailPassword')
    }
    get verificationUrl(): string {
        return this.configService.get<string>('email.emailVerificationUrl')
    }
    get urlToFrontend(): string {
        return this.configService.get<string>('email.urlToFrontend')
    }
}
