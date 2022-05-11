import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { CreatePurchaseDto } from './dto/createPurchase.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import JwtAccessGuard from '../../core/guards/auth/JwtAccess.guard'

@Controller('purchase')
export class PurchasesController {
    constructor(private readonly purchaseService: PurchasesService) {}

    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(JwtAccessGuard)
    async createPurchases(@Body() dto: CreatePurchaseDto, @UploadedFile() image: Express.Multer.File) {
        return this.purchaseService.createPurchase(dto, image)
    }

    @Get(':id')
    async getAllUserPurchases(@Param('id', ParseIntPipe) id: number) {
        return this.purchaseService.getAllUserPurchases(id)
    }
}
