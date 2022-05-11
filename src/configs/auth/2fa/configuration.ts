import { registerAs } from '@nestjs/config'

export default registerAs('2fa', () => ({
    appName: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
}))
