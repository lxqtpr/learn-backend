import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import configuration from './configuration'
import { JwtConfigService } from './config.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                JWT_ACCESS_SECRET: Joi.string(),
                JWT_REFRESH_SECRET: Joi.string(),
                JWT_VERIFICATION_SECRET: Joi.string().required(),
                ACCESS_EXPIRES_IN: Joi.string().required(),
                REFRESH_EXPIRES_IN: Joi.string().required(),
                VERIFICATION_EXPIRES_IN: Joi.string().required(),
            }),
        }),
    ],
    providers: [JwtConfigService],
    exports: [JwtConfigService],
})
export class JwtConfigModule {}
