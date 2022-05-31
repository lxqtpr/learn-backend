import { Module } from '@nestjs/common'
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module'
import { AuthModule } from './providers/auth/auth.module'
@Module({
    imports: [PostgresDatabaseProviderModule, AuthModule],
})
export class AppModule {}
