import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { UploadService } from './upload.service';


const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: multerS3({
        s3,
        bucket: 'nestjs-aws-image',
        acl: 'public-read',
        key: function (request, file, cb) {
          cb(null, `abc/${Date.now().toString()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFiles() files: Express.MulterS3.File[]) {
    console.log(files)
    return this.uploadService.uploadFile(files);
  }

  @ApiResponse({description:"객체를 성공적으로 삭제하였습니다."})
  @ApiBody({type:[String], required:true})
  @Delete('delete')
  async deleteFile(
    @Body('s3Img') s3Img:string[]
  ){
    return this.uploadService.deleteFile(s3Img)
  }
}
