import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleConfigService {
    constructor(private readonly configService: ConfigService) {}
    get googleAuthClientId(): string {
        return this.configService.get<string>(`google.googleAuthClientId`)
    }
    get googleAuthClientSecret(): string {
        return this.configService.get<string>(`google.googleAuthClientSecret`)
    }
}
