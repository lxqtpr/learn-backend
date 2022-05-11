import { Module } from '@nestjs/common'
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module'
import { AuthModule } from './providers/auth/auth.module'
import { PurchasesModule } from './models/purchases/purchases.module'

@Module({
    imports: [PostgresDatabaseProviderModule, AuthModule, PurchasesModule],
})
export class AppModule {}
