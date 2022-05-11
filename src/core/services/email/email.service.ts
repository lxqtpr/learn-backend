import { Injectable } from '@nestjs/common'
import { createTransport } from 'nodemailer'
import * as Mail from 'nodemailer/lib/mailer'
import { EmailConfigService } from '../../../configs/auth/email/config.service'
import { JwtAuthService } from '../../../providers/auth/jwt/jwt.service'

@Injectable()
export default class EmailService {
    private nodemailerTransport: Mail

    constructor(private readonly emailConfigService: EmailConfigService, public readonly jwtService: JwtAuthService) {
        this.nodemailerTransport = createTransport({
            service: emailConfigService.emailService,
            auth: {
                user: emailConfigService.emailUser,
                pass: emailConfigService.emailPassword,
            },
        })
    }

    public async sendVerificationLink(email: string) {
        const token = await this.jwtService.getVerificationToken(email)
        const url = `${this.emailConfigService.verificationUrl}?token=${token}`
        const text = `Welcome to the application. To confirm the email address, click here: ${url}`
        return this.sendMail({
            to: email,
            subject: 'Email confirmation',
            text,
        })
    }

    sendMail(options: Mail.Options) {
        return this.nodemailerTransport.sendMail(options)
    }
}
