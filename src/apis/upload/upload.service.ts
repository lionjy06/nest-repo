import { BadRequestException, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  async uploadFile(files: Express.MulterS3.File[]) {
    try{
      const result = files.map( async v => {
        const data = await this.uploadRepository.insert({
          originalName:v.originalname,
          mimeType:v.mimetype,
          size:v.size,
          url:v.location,
        })
      })
    }catch (e) {
      console.error(e)
    }
  }
}
