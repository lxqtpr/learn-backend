import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import User from './entity/user.entity'
import { Repository } from 'typeorm'
import { compare, hash } from 'bcrypt'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await compare(plainTextPassword, hashedPassword)
        if (!isPasswordMatching) throw new BadRequestException('Wrong credentials provided')
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const hashToken = await hash(refreshToken, 10)
        await this.userRepository.update(userId, {
            refreshToken: hashToken,
        })
    }
    
    async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
        const user = await this.userRepository.findOne({where: { id }})
        const isRefreshTokenMatching = await compare(refreshToken, user.refreshToken)
        if (isRefreshTokenMatching) {
            return user
        }
    }

    async getAuthUser(email: string, plainTextPassword: string) {
        try {
            const user = await this.userRepository.findOne({where: { email }})
            await this.verifyPassword(plainTextPassword, user.password)
            return user
        } catch (error) {
            throw new BadRequestException('Wrong credentials provided')
        }
    }

    async removeRefreshToken(userId: number) {
        return this.userRepository.update(userId, {
            refreshToken: null,
        })
    }

    async markEmailAsConfirmed(email: string) {
        return this.userRepository.update(
            { email },
            {
                isEmailConfirmed: true,
            }
        )
    }

    async setTwoFactorAuthSecret(secret: string, userId: number) {
        return this.userRepository.update(userId, {
            twoFactorAuthSecret: secret,
        })
    }

    async turnOnTwoFactorAuth(userId: number) {
        return this.userRepository.update(userId, {
            isTwoFactorAuthEnabled: true,
        })
    }

    async createWithGoogle(email: string) {
        const newUser = await this.userRepository.create({ email, isRegisteredWithGoogle: true, });
        await this.userRepository.save(newUser);
        return newUser;
    }
}
