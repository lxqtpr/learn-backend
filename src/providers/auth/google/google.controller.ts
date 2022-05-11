import {
    Controller,
    Post,
    Body,
    Req, Logger, UseGuards, Get,
} from '@nestjs/common'
import { Request } from 'express';
import { GoogleAuthService } from './google.service'
import { TokenVerificationDto } from './dto/TokenVerificationDto'
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class GoogleAuthController {
    constructor( private readonly googleAuthService: GoogleAuthService ) {}
    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    async authenticate(@Body() tokenData: TokenVerificationDto, @Req() request: Request) {
        // @ts-ignore
        const { accessCookie, refreshCookie, user } = await this.googleAuthService.authenticate(request.user.accessToken);
        request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
        return user;
    }

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
       if (!req.user) {
            return 'No user from google'
        }
        return {
            message: 'User information from google',
            user: req.user
        }
    }
}