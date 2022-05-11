import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import configuration from './configuration'
import { EmailConfigService } from './config.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                EMAIL_SERVICE: Joi.string().required(),
                EMAIL_USER: Joi.string().required(),
                EMAIL_PASSWORD: Joi.string().required(),
                EMAIL_CONFIRMATION_URL: Joi.string().required(),
                EMAIL_URL_TO_FRONTEND: Joi.string().required(),
            }),
        }),
    ],
    providers: [EmailConfigService],
    exports: [EmailConfigService],
})
export class EmailConfigModule {}
