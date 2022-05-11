import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import configuration from './configuration'
import { TFAConfigService } from './config.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                TWO_FACTOR_AUTHENTICATION_APP_NAME: Joi.string().required(),
            }),
        }),
    ],
    providers: [TFAConfigService],
    exports: [TFAConfigService],
})
export class TFAConfigModule {}
