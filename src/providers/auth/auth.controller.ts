import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../../models/user/dto/createUser.dto'
import { ReqUser } from '../../core/decorators/auth/getUserFromReq.decorator'
import User from '../../models/user/entity/user.entity'
import JwtAccessGuard from '../../core/guards/auth/JwtAccess.guard'
import JwtRefreshGuard from '../../core/guards/auth/JwtRefresh.guard'
import { LocalAuthenticationGuard } from '../../core/guards/auth/LocalAuth.guard'
import { ApiBody, ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('registration')
    @ApiBody({type: CreateUserDto})
    async registration(@Body() userDto: CreateUserDto, @Req() req: Request) {
        return await this.authService.registration(userDto, req)
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async login(@ReqUser() user: User, @Req() req: Request) {
        return await this.authService.login(user, req)
    }

    @HttpCode(200)
    @UseGuards(JwtAccessGuard)
    @Post('logout')
    async logout(@ReqUser() user: User, @Req() req: Request) {
        return await this.authService.logout(user, req)
    }

    @Get('emailConfirm')
    async emailConfirm(@Query('token') token: string, @Res() res: Response) {
        return await this.authService.confirmEmail(token, res)
    }

    @Post('isTwoFactorEnable')
    @UseGuards(LocalAuthenticationGuard)
    async isTwoFactorEnable(@ReqUser() user: User){
        return await this.authService.isTwoFactorEnable(user)
    }

    @Post('resendConfirmationLink')
    @UseGuards(JwtAccessGuard)
    async resendConfirmationLink(@ReqUser() user: User) {
        await this.authService.resendConfirmationLink(user.id)
    }

    @UseGuards(JwtRefreshGuard)
    @Get('/refresh')
    async refresh(@ReqUser() user: User, @Req() req: Request) {
        return await this.authService.refresh(user, req)
    }
}
