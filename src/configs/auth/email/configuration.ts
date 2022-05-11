import { registerAs } from '@nestjs/config'

export default registerAs('email', () => ({
    emailService: process.env.EMAIL_SERVICE,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailVerificationUrl: process.env.EMAIL_CONFIRMATION_URL,
    urlToFrontend: process.env.EMAIL_URL_TO_FRONTEND,
}))
