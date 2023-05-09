
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { AlbumImage } from 'src/tourpackage/entities/albumimage.entity';
import { MainImage } from 'src/tourpackage/entities/mainimage.entity';
import { VisitedPlace } from 'src/tourpackage/entities/visitedplace.entity';
import { User } from 'src/userProfile/entitties/user.entity';


@Module({
  imports: [
  TypeOrmModule.forFeature([Tourpackage, AlbumImage, MainImage, VisitedPlace, User])],
  controllers: [S3Controller],
  providers: [S3Service],
  exports:[S3Service]
})
export class S3Module {}
