import { Controller, Post, UseGuards, Body, HttpCode, Res } from '@nestjs/common'
import { UserService } from '../../../models/user/user.service'
import { ReqUser } from '../../../core/decorators/auth/getUserFromReq.decorator'
import User from '../../../models/user/entity/user.entity'
import { Response, Request } from 'express'
import { TwoFactorAuthCodeDto } from './dto/TwoFactorAuthenticationCodeDto'
import { TwoFactorAuthService } from './2fa.service'
import { LocalAuthenticationGuard } from '../../../core/guards/auth/LocalAuth.guard'

@Controller('twoFactorAuth')
export class TwoFactorAuthController {
    constructor(
        private readonly userService: UserService,
        private readonly twoFactorAuthService: TwoFactorAuthService
    ) {}

    @Post('generateQrCode')
    @UseGuards(LocalAuthenticationGuard)
    async generateTwoFactorQr (@ReqUser() user: User, @Res() res: Response,) {
        return await this.twoFactorAuthService.generateTwoFactorQr(user, res)
    }

    @Post('confirmTwoFactorAuth')
    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    async turnOnTwoFactorAuth( @ReqUser() user: User, @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto, req: Request ) {
        return await this.twoFactorAuthService.turnOnTwoFactorAuth(user, twoFactorAuthCode, req )
    }
}
