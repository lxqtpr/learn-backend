import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import configuration from './configuration'
import { GoogleConfigService } from './config.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
                GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
            }),
        }),
    ],
    providers: [GoogleConfigService],
    exports: [GoogleConfigService],
})
export class GoogleConfigModule {}
