import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreatePurchaseDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    price: string
}
