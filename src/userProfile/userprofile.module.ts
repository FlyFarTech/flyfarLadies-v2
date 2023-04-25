
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
import { Cash } from "./entitties/cash.entity";
import { Cheque } from "./entitties/cheq.entity";
import { BankTransfer } from "./entitties/BankTransfer.entity";
import { CardPayment } from "./entitties/Cardpayment.entity";
import { Bkash } from "./entitties/Bkash.entity";
import { MobileBanking } from "./entitties/MobileBanking.enity";

@Module({
   imports: [TypeOrmModule.forFeature([Userprofile,Tourpackage,User,Cheque,Cash, BankTransfer, CardPayment, Bkash, MobileBanking]),   
   JwtModule.register({
      secret: jwtConstants.secret,
      signOptions:{expiresIn:'1d'},
   }), S3Module,TourpackageModule,],

   controllers:[userProfileController],
   providers:[UserProfileServices, JwtStrategy]

})

export class UsderProfileModule{}