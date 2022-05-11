import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import User from '../../models/user/entity/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from '../../models/user/dto/createUser.dto'
import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { JwtAuthService } from './jwt/jwt.service'
import { UserService } from '../../models/user/user.service'
import EmailService from '../../core/services/email/email.service'
import { EmailConfigService } from '../../configs/auth/email/config.service'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtAuthService: JwtAuthService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly emailConfigService: EmailConfigService
    ) {}

    async registration(dto: CreateUserDto, req: Request) {
        const exitedUser = await this.userRepository.findOne({ email: dto.email })
        if (exitedUser) throw new BadRequestException('User with this email already exist')
        const hashedPassword = await hash(dto.password, 10)

        const newUser = await this.userRepository.create({
            ...dto,
            password: hashedPassword,
        })
        await this.userRepository.save(newUser)

        const accessTokenCookie = await this.jwtAuthService.getCookieWithJwtAccessToken(newUser.id)
        const { refreshCookie, refreshToken } = await this.jwtAuthService.getCookieWithJwtRefreshToken(newUser.id)
        newUser.refreshToken = await hash(refreshToken, 10)

        this.emailService.sendVerificationLink(dto.email)
        req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshCookie])

        return await this.userRepository.save(newUser)
    }

    async login(user: User, req: Request) {
        const accessTokenCookie = await this.jwtAuthService.getCookieWithJwtAccessToken(user.id)
        const { refreshCookie, refreshToken } = await this.jwtAuthService.getCookieWithJwtRefreshToken(user.id)
        await this.userService.setCurrentRefreshToken(refreshToken, user.id)
        req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshCookie])
        if (user.isTwoFactorAuthEnabled) {
            return;
        }
        return user;
    }

    async logout(user: User, req: Request) {
        await this.userService.removeRefreshToken(user.id)
        req.res.setHeader('Set-Cookie', [
            'Access=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0',
        ])
    }

    public async confirmEmail(token: string, res: Response) {
        const email = await this.jwtAuthService.decodeConfirmationToken(token)
        const user = await this.userRepository.findOne({ email })
        if (user?.isEmailConfirmed) {
            throw new BadRequestException('Email already confirmed')
        }
        await this.userService.markEmailAsConfirmed(email)
        res.redirect(this.emailConfigService.urlToFrontend)
    }

    public async isTwoFactorEnable(user: User){
        return user.isTwoFactorAuthEnabled
    }

    public async resendConfirmationLink(id: number) {
        const user = await this.userRepository.findOne({ id })
        if (user?.isEmailConfirmed) {
            throw new BadRequestException('Email already confirmed')
        }
        await this.emailService.sendVerificationLink(user.email)
    }
    async refresh(user: User, req: Request) {
            const accessTokenCookie = await this.jwtAuthService.getCookieWithJwtAccessToken(user.id, user.isTwoFactorAuthEnabled)
            const { refreshCookie, refreshToken } = await this.jwtAuthService.getCookieWithJwtRefreshToken(user.id)
            await this.userService.setCurrentRefreshToken(refreshToken, user.id)
            req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshCookie])
    }
}
