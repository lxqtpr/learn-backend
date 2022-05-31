import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class TwoFactorAuthCodeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty( {description: 'Code from email' } )
    twoFactorAuthCode: string
}
