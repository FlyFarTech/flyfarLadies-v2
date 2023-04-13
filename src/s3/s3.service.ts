import { AlbumImage } from './../tourpackage/entities/albumimage.entity';
import { DeleteObjectCommand, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MainImage } from 'src/tourpackage/entities/mainimage.entity';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { VisitedPlace } from 'src/tourpackage/entities/visitedplace.entity';
import { Repository } from 'typeorm';

@Injectable()
export class S3Service {
    private logger = new Logger(S3Service.name)
    private region: string;
    private s3: S3Client;
    constructor(
        @InjectRepository(Tourpackage) private TourpackageRepo: Repository<Tourpackage>,
        @InjectRepository(AlbumImage) private AlbumimageRepo: Repository<AlbumImage>,
        @InjectRepository(MainImage) private MainImageeRepo: Repository<MainImage>,
        @InjectRepository(VisitedPlace) private VisitedPlaceRepo: Repository<VisitedPlace>,
        private ConfigService: ConfigService) {
        this.region = this.ConfigService.get<string>('DO_REGION') || 'sgp1';
        this.s3 = new S3Client({
            endpoint: "https://sgp1.digitaloceanspaces.com",
            region: 'sgp1',
            credentials: {
                accessKeyId: 'DO007KE3UW4VALKKWU4G',
                secretAccessKey: 'gJ9x9vxAlZr8BQbNqpw0eUpcUqTDzipaTZb4UQ5oI0Q'
            }
        });
    }


    // Add image 
    async Addimage(file: Express.Multer.File) {
        const bucket = this.ConfigService.get<string>('DO_BUCKET_NAME');
        const key = file.originalname
        const input: PutObjectCommandInput = {
            Body: file.buffer,
            Bucket: bucket,
            Key: key,
            ACL: 'public-read',
            ContentType: file.mimetype
        }
        try {
            const response: PutObjectCommandOutput = await this.s3.send(
                new PutObjectCommand(input),
            );
            if (response.$metadata.httpStatusCode === 200) {
                return `https://${bucket}.${this.region}.cdn.digitaloceanspaces.com/${key}`
            }
            throw new Error("image not save in digital ocean s3")
        } catch (err) {
            this.logger.error("cannot save file inside s3 spacebucket", err);
            throw err;
        }

    }
    // update cover image 
    async updateImage(Id: number, file: Express.Multer.File) {
        const tourpackage = await this.TourpackageRepo.findOneBy({ Id })
        const bucket = this.ConfigService.get<string>('DO_BUCKET_NAME')
        if (tourpackage.coverimageurl) {
            const coverimageurl = tourpackage.coverimageurl.split('/').pop();
            await this.s3.send(new DeleteObjectCommand({
                Bucket: bucket,
                Key: coverimageurl
            }))
        }
        const key = file.originalname
        try {
            const response: PutObjectCommandOutput = await this.s3.send(
                new PutObjectCommand({
                    Body: file.buffer,
                    Bucket: bucket,
                    Key: key,
                    ACL: 'public-read',
                    ContentType: file.mimetype
                }),
            );
            if (response.$metadata.httpStatusCode === 200) {
                return `https://${bucket}.${this.region}.cdn.digitaloceanspaces.com/${key}`

            }
            throw new Error("image not update in digital ocean s3")

        }
        catch (err) {
            this.logger.error("cannot save file inside s3 spacebucket", err);
            throw err;
        }


    }

    async updateAlbumImage(Id: number, AlbumId: number, file: Express.Multer.File) {
        const tourpackage = await this.TourpackageRepo.findOneBy({ Id })
        if (!tourpackage) {
            throw new HttpException(
                `TourPackage not found with this id=${Id}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const albummage = await this.AlbumimageRepo.findOneBy({ AlbumId })
        if (!albummage) {
            throw new HttpException(
                `albummage not found with this id=${Id}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const bucket = this.ConfigService.get<string>('DO_BUCKET_NAME')
        if (albummage.albumImageUrl) {
            const albumImageUrl = albummage.albumImageUrl.split('/').pop();
            await this.s3.send(new DeleteObjectCommand({
                Bucket: bucket,
                Key: albumImageUrl
            }))
        }
        const key = file.originalname
        try {
            const response: PutObjectCommandOutput = await this.s3.send(
                new PutObjectCommand({
                    Body: file.buffer,
                    Bucket: bucket,
                    Key: key,
                    ACL: 'public-read',
                    ContentType: file.mimetype
                }),
            );
            if (response.$metadata.httpStatusCode === 200) {
                return `https://${bucket}.${this.region}.cdn.digitaloceanspaces.com/${key}`

            }
            throw new Error("image not update in digital ocean s3")

        }
        catch (err) {
            this.logger.error("cannot save file inside s3 spacebucket", err);
            throw err;
        }


    }

    async updateMainImage(Id: number, mainimgId: number, file: Express.Multer.File) {
        const tourpackage = await this.TourpackageRepo.findOneBy({ Id })
        if (!tourpackage) {
            throw new HttpException(
                `TourPackage not found with this id=${Id}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const mainImage = await this.MainImageeRepo.findOneBy({ mainimgId })
        if (!mainImage) {
            throw new HttpException(
                `mainImage not found with this id=${Id}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const bucket = this.ConfigService.get<string>('DO_BUCKET_NAME')
        if (mainImage.MainImageUrl) {
            const MainImageUrl = mainImage.MainImageUrl.split('/').pop();
            await this.s3.send(new DeleteObjectCommand({
                Bucket: bucket,
                Key: MainImageUrl
            }))
        }
        const key = file.originalname
        try {
            const response: PutObjectCommandOutput = await this.s3.send(
                new PutObjectCommand({
                    Body: file.buffer,
                    Bucket: bucket,
                    Key: key,
                    ACL: 'public-read',
                    ContentType: file.mimetype
                }),
            );
            if (response.$metadata.httpStatusCode === 200) {
                return `https://${bucket}.${this.region}.cdn.digitaloceanspaces.com/${key}`

            }
            throw new Error("image not update in digital ocean s3")

        }
        catch (err) {
            this.logger.error("cannot save file inside s3 spacebucket", err);
            throw err;
        }


    }


    async updatevisitedImage(Id: number, VimageId: number, file: Express.Multer.File) {
        const tourpackage = await this.TourpackageRepo.findOneBy({ Id })
        if (!tourpackage) {
            throw new HttpException(
                `TourPackage not found with this id=${Id}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const VisitedImage = await this.VisitedPlaceRepo.findOneBy({ VimageId })
        if (!VisitedImage) {
            throw new HttpException(
                `VisitedImage not found with this id=${Id}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const bucket = this.ConfigService.get<string>('DO_BUCKET_NAME')
        if (VisitedImage.VisitedImagePath) {
            const VisitedImagePath = VisitedImage.VisitedImagePath.split('/').pop();
            await this.s3.send(new DeleteObjectCommand({
                Bucket: bucket,
                Key: VisitedImagePath
            }))
        }
        const key = file.originalname
        try {
            const response: PutObjectCommandOutput = await this.s3.send(
                new PutObjectCommand({
                    Body: file.buffer,
                    Bucket: bucket,
                    Key: key,
                    ACL: 'public-read',
                    ContentType: file.mimetype
                }),
            );
            if (response.$metadata.httpStatusCode === 200) {
                return `https://${bucket}.${this.region}.cdn.digitaloceanspaces.com/${key}`

            }
            throw new Error("image not update in digital ocean s3")

        }
        catch (err) {
            this.logger.error("cannot save file inside s3 spacebucket", err);
            throw err;
        }


    }
}
