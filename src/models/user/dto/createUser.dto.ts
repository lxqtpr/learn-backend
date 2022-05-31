import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty( {description: 'User email' } )
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({ description: 'User password', minimum: 6, })
    password: string
}
