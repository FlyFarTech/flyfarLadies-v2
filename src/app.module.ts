
import { ConfigModule } from '@nestjs/config';
import { Userprofile } from './userProfile/entitties/userprofile.entities';
import { Tourpackage } from './tourpackage/entities/tourpackage.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TourpackageModule } from './tourpackage/tourpackage.module';
import { AlbumImage } from './tourpackage/entities/albumimage.entity';
import { packageexcluions } from './tourpackage/entities/packageexclsuions.entity';
import { Packageinclusion } from './tourpackage/entities/packageInclusion.entitry';
import { tourpackageplan } from './tourpackage/entities/tourpackageplan.entity';
import { packagehighlight } from './tourpackage/entities/packagehighlight.entity';
import { bookingpolicy } from './tourpackage/entities/bookingpolicy.entity';
import { VisitedPlace } from './tourpackage/entities/visitedplace.entity';
import { Traveller } from './Traveller/entities/traveller.entity';
import { Admin } from './Auth/entities/user.entity';
import { UserModule } from './Auth/user.module';
import { TravellerModule } from './Traveller/traveller.module';
import { UsderProfileModule } from './userProfile/userprofile.module';
import { refundpolicy } from './tourpackage/entities/refundpolicy.entity';
import { MainImage } from './tourpackage/entities/mainimage.entity';
import { S3Module } from './s3/s3.module';
import { Installment } from './tourpackage/entities/installment.entity';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entity/booking.entity';
import { User } from './userProfile/entitties/user-login.entity';
import { Cheque } from './userProfile/entitties/cheq.entity';
import { Cash } from './userProfile/entitties/cash.entity';
import { BankTransfer } from './userProfile/entitties/BankTransfer.entity';
import { CardPayment } from './userProfile/entitties/Cardpayment.entity';
import { Bkash } from './userProfile/entitties/Bkash.entity';
import { MobileBanking } from './userProfile/entitties/MobileBanking.enity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal:true }),
    TypeOrmModule.forRoot({
      type:'mysql',
      // username:"flyfarladies",
      // password: "F3r2r28AsiFzW8Ke",
      // host: "159.89.238.24",
      // database:"flyfarladies",

      username:process.env.LOCAL_USERNAME,
      password: process.env.LOCAL_PASSWORD,
      host : process.env.LOCAL_HOST,
      database:process.env.LOCAL_DATABASE,
      port:3306,
      entities: [Admin,
        User,
        Cheque,
        Cash,
        BankTransfer,
        CardPayment,
        Bkash,
        MobileBanking,
        Tourpackage,
        MainImage,
        AlbumImage,
        packageexcluions,
        Packageinclusion,
        tourpackageplan,
        packagehighlight,
        bookingpolicy,
        VisitedPlace,
        Userprofile,
        Traveller,
        refundpolicy,
        Installment,
        Booking
      ],
      synchronize:false
    }),
    UserModule,
    TourpackageModule,
    TravellerModule,
    UsderProfileModule,
    S3Module,
    ConfigModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
