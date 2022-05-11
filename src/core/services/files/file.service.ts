import { Injectable } from '@nestjs/common'
import { FileRes } from './file.interface'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'

@Injectable()
export class FileService {
    async saveFile(files: Express.Multer.File[], folder: string = 'default'): Promise<FileRes[]> {
        const uploadFolder = `${path}/uploads/${folder}`
        await ensureDir(uploadFolder)

        return await Promise.all(
            files.map(async file => {
                await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)
                return {
                    url: `/uploads/${folder}/${file.originalname}`,
                    name: `${file.originalname}`,
                }
            })
        )
    }
}
