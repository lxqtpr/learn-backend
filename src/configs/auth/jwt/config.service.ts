import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtConfigService {
    constructor(private readonly configService: ConfigService) {}

    get accessSecret(): string {
        return this.configService.get<string>(`jwt.accessSecret`)
    }
    get refreshSecret(): string {
        return this.configService.get<string>(`jwt.refreshSecret`)
    }
    get verificationSecret(): string {
        return this.configService.get<string>('jwt.verificationSecret')
    }
    get accessExpiresIn(): number {
        return this.configService.get<number>('jwt.accessExpiresIn')
    }
    get refreshExpiresIn(): number {
        return this.configService.get<number>('jwt.refreshExpiresIn')
    }
    get verificationExpiresIn(): number {
        return this.configService.get<number>('jwt.verificationExpiresIn')
    }
}
