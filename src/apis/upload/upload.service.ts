import { BadRequestException, Body, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { randomUUID } from 'crypto';
import * as AWS from 'aws-sdk';
import { classToPlain, instanceToPlain } from 'class-transformer';

const s3 = new AWS.S3();
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  async uploadFile(files: Express.MulterS3.File[]) {
    try {
      console.log(files);
      const result = files.map(async (v) => {
        const data = await this.uploadRepository.insert({
          originalName: v.originalname,
          mimeType: v.mimetype,
          size: v.size,
          url: v.location,
          key: v.key,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  async deleteFile(s3Img) {
    const image = await this.uploadRepository.findOne({
      where: { id: s3Img },
      select: ['key'],
    });
    const plainImg = instanceToPlain(image);

    const params = {
      Bucket: 'nestjs-aws-image',
      Delete: {
        Objects: [
          {
            Key: plainImg.key,
          },
        ],
        Quiet: false,
      },
    };
    s3.deleteObjects(params, (err, data) => {
      if (err) console.error(err);
      else console.log(data);
    });

    const deletedImg = await this.uploadRepository.softDelete({ id: s3Img });

    return deletedImg.affected ? true : false;
  }
}
