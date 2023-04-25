
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Userprofile } from "./entitties/userprofile.entities";
import { userProfileController } from './userprofile.controller';
import { UserProfileServices } from './userprofile.services';
import { Tourpackage } from "src/tourpackage/entities/tourpackage.entity";
import { TourpackageModule } from "src/tourpackage/tourpackage.module";
import { S3Module } from "src/s3/s3.module";
import { User } from "./entitties/user-login.entity";
import { jwtConstants } from "./constant";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";

@Module({
   imports: [TypeOrmModule.forFeature([Userprofile,Tourpackage,User]),   
   JwtModule.register({
      secret: jwtConstants.secret,
      signOptions:{expiresIn:'1d'},
   }), S3Module,TourpackageModule,],

   controllers:[userProfileController],
   providers:[UserProfileServices, JwtStrategy]

})

export class UsderProfileModule{}