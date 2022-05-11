import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TFAConfigService {
    constructor(private readonly configService: ConfigService) {}

    get appName(): string {
        return String(this.configService.get<string>(`2fa.appName`))
    }
}
