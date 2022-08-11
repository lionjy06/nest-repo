import { BadRequestException, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { randomUUID } from 'crypto';
import * as AWS from 'aws-sdk';
import { instanceToPlain } from 'class-transformer';

const s3 = new AWS.S3();

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  async uploadFile(files: Express.MulterS3.File[]) {
    try {
      const result = files.map(async (v) => {
        const data = await this.uploadRepository.insert({
          originalName: v.originalname,
          mimeType: v.mimetype,
          size: v.size,
          url: v.location,
          Key: v.key,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  async deleteFile(s3Img) {
    try {
      const images = await Promise.all(
        s3Img.map(async (v) => {
          const img = await this.uploadRepository.findOne({
            where: { id: v },
            select: ['Key'],
          });

          const pureImg = instanceToPlain(img);
          return pureImg;
        }),
      );

      const params = {
        Bucket: 'nestjs-aws-image',
        Delete: {
          Objects: images,
          Quiet: false,
        },
      };

      s3.deleteObjects(params, (err, data) => {
        if (err) console.error(err);
        else console.log(data);
      });

      const result = s3Img.map(async (v) => {
        await this.uploadRepository.softDelete({
          id: v,
        });
      });

      return '성공';
    } catch (e) {
      console.error(e);
    }
  }
}
