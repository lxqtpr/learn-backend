import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { DatabaseType } from 'typeorm'
import { PostgresConfigModule } from '../../../configs/database/postgres/config.module'
import { PostgresConfigService } from '../../../configs/database/postgres/config.service'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [PostgresConfigModule],
            useFactory: async (postgresConfigService: PostgresConfigService) => {
                return {
                    type: 'postgres' as DatabaseType,
                    host: postgresConfigService.host,
                    port: postgresConfigService.port,
                    username: postgresConfigService.user,
                    password: postgresConfigService.password,
                    database: postgresConfigService.database,
                    logging: false,
                    synchronize: true,
                    migrationsRun: false,
                    extra: {
                        max: 10,
                        connectionTimeoutMillis: 2000,
                    },
                    entities: [__dirname + '/../../../**/*.entity.js'],
                    migrations: [__dirname + '/../../../database/migrations/**/*.js'],
                }
            },
            inject: [PostgresConfigService],
        } as TypeOrmModuleAsyncOptions),
    ],
})
export class PostgresDatabaseProviderModule {}
