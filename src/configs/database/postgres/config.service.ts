import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PostgresConfigService {
    constructor(private configService: ConfigService) {}

    get host(): string {
        return this.configService.get<string>(`postgres.host`)
    }

    get port(): number {
        return Number(this.configService.get<string>(`postgres.port`))
    }

    get user(): string {
        return this.configService.get<string>(`postgres.username`)
    }

    get password(): string {
        return this.configService.get<string>(`postgres.password`)
    }

    get database(): string {
        return this.configService.get<string>(`postgres.database`)
    }
}
