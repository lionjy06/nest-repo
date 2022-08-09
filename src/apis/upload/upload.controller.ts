import {
  Controller,
  Delete,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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

  @Delete('delete')
  async deleteFile(){
    const params = {
      Bucket:'nestjs-aws-image',
      Delete: {
        Objects: [
          {
            Key:'abc/1660029953170-strawberryMilk.png',
            // VersionId:'3tcirrg8FeEIB4Fc29ZSe4MOw6pgkXJV'
          },
          // {
          //   Key:'abc/1660029803639-typeorm.png',
          //   // VersionId:'5G.CiCShyqaM6WEGHWaxTICYX9IMXN5u'
          // }
        ],
        Quiet: false
      }
    }
    s3.deleteObjects(params, (err, data) => {
      if (err) console.error(err)
      else console.log(data)
    })
  }

}
