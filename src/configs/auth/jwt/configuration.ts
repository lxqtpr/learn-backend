import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    verificationSecret: process.env.JWT_VERIFICATION_SECRET,
    accessExpiresIn: process.env.ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN,
    verificationExpiresIn: process.env.VERIFICATION_EXPIRES_IN,
}))
