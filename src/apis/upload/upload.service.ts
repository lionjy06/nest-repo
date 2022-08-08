import { BadRequestException, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  async uploadFile(files: Express.MulterS3.File[]) {
    const uploadfiles = [];
    for (const element of files) {
      const file = new Upload();
      file.originalName = element.originalname;
      file.mimeType = element.mimetype;
      file.size = element.size;
      file.url = element.location;

      uploadfiles.push(file);
    }

    try {
      return { data: await this.uploadRepository.save(uploadfiles) };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
