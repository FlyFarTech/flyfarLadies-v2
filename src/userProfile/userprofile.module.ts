
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Userprofile } from "./entitties/userprofile.entities";
import { userProfileController } from './userprofile.controller';
import { UserProfileServices } from './userprofile.services';
import { Tourpackage } from "src/tourpackage/entities/tourpackage.entity";
import { TourpackageModule } from "src/tourpackage/tourpackage.module";
// import { S3Module } from "src/s3/s3.module";

@Module({
   imports: [TypeOrmModule.forFeature([Userprofile,Tourpackage]),TourpackageModule,],
   controllers:[userProfileController],
   providers:[UserProfileServices]

})

export class UsderProfileModule{}