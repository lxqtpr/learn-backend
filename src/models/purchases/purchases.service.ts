import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import Purchase from './entity/purchases.entity'
import { Repository } from 'typeorm'
import { CreatePurchaseDto } from './dto/createPurchase.dto'
import { FileService } from '../../core/services/files/file.service'

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Purchase)
        private readonly purchaseRepository: Repository<Purchase>,
        private readonly fileService: FileService
    ) {}

    async createPurchase(purchaseDto: CreatePurchaseDto, image: Express.Multer.File) {
        const file = await this.fileService.saveFile([image], 'purchases')
        const purchase = this.purchaseRepository.create({ ...purchaseDto, imageUrl: file[0].url })
        return this.purchaseRepository.save(purchase)
    }

    async getAllUserPurchases(userId: number) {
        return this.purchaseRepository.find({
            relations: ['buyer'],
            where: { buyer: userId },
        })
    }
}
