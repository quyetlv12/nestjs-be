// src/r2/r2.service.ts
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

@Injectable()
export class R2Service {
    private s3: S3Client;
    private bucket: string;

    constructor(private configService: ConfigService) {
        this.bucket = this.configService.get<string>('R2_BUCKET_NAME')!;
        this.s3 = new S3Client({
            region: this.configService.get<string>('R2_REGION')!,
            endpoint: this.configService.get<string>('R2_ENDPOINT')!,
            credentials: {
                accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID')!,
                secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY')!,
            },
        });
    }


    async uploadFile(file: Express.Multer.File): Promise<string> {
        
        const ext = file.originalname.split('.').pop();
        let folder = 'others';
        if (file.mimetype.startsWith('image/')) {
            folder = 'images';
        } else if (file.mimetype.startsWith('video/')) {
            folder = 'videos';
        }
        const date = dayjs().format('MM-DD-YYYY')
        
        const key = `uploads/${folder}/${date}/${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        const url = `https://pub-${this.configService.get<string>('R2_BUCKET_ID')}.r2.dev/${key}`;
        return url;
    }

    async deleteFile(key: string): Promise<void> {
        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
        );
    }
}
