import { Injectable, UnauthorizedException } from '@nestjs/common';

import { google, Auth } from 'googleapis';
import { UserService } from '../../../models/user/user.service'
import { GoogleConfigService } from '../../../configs/auth/google/config.service'
import User from '../../../models/user/entity/user.entity'
import { JwtAuthService } from '../jwt/jwt.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class GoogleAuthService {
    oauthClient: Auth.OAuth2Client;
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
        private readonly googleConfigService: GoogleConfigService,
        private readonly jwtAuthService: JwtAuthService
    ) {
        const clientID = this.googleConfigService.googleAuthClientId;
        const clientSecret = this.googleConfigService.googleAuthClientSecret;
        this.oauthClient = new google.auth.OAuth2(
            clientID,
            clientSecret
        );
    }

    async getUserData(token: string) {
        const userInfoClient = google.oauth2('v2').userinfo;
        this.oauthClient.setCredentials({
            access_token: token
        })
        const userInfoResponse = await userInfoClient.get({
            auth: this.oauthClient
        });
        return userInfoResponse.data;
    }

    async getCookiesForUser(user: User) {
        const accessCookie = await this.jwtAuthService.getCookieWithJwtAccessToken(user.id);
        const { refreshCookie, refreshToken } = await this.jwtAuthService.getCookieWithJwtRefreshToken(user.id);
        await this.userService.setCurrentRefreshToken ( refreshToken, user.id );
        return {
            accessCookie,
            refreshCookie
        }
    }

    async handleRegisteredUser(user: User) {
        if (!user.isRegisteredWithGoogle) {throw new UnauthorizedException();}
        const { accessCookie, refreshCookie } = await this.getCookiesForUser(user);
        return {
            accessCookie,
            refreshCookie,
            user
        }
    }

    async registerUser(email: string) {
        const user = await this.userService.createWithGoogle(email);
        return this.handleRegisteredUser(user);
    }

    async authenticate(token: string) {
        const tokenInfo = await this.oauthClient.getTokenInfo(token);
        const email = tokenInfo.email;
        try {
            const user = await this.userRepository.findOne({email});
            return this.handleRegisteredUser(user);
        } catch (error) {
            if (error.status !== 404) {throw new error;}return this.registerUser(email);
        }
    }
}