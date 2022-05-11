import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Purchase from './entity/purchases.entity'
import { PurchasesService } from './purchases.service'
import { PurchasesController } from './purchases.controller'
import { FileModule } from '../../core/services/files/file.module'

@Module({
    imports: [TypeOrmModule.forFeature([Purchase]), FileModule],
    providers: [PurchasesService],
    controllers: [PurchasesController],
})
export class PurchasesModule {}
