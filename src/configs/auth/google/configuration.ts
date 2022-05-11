import { registerAs } from '@nestjs/config'

export default registerAs('google', () => ({
    googleAuthClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    googleAuthClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET
}))
