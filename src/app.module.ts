
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
import { User } from './Auth/entities/user.entity';
import { UserModule } from './Auth/user.module';
import { TravellerModule } from './Traveller/traveller.module';
import { UsderProfileModule } from './userProfile/userprofile.module';
import { refundpolicy } from './tourpackage/entities/refundpolicy.entity';
import { MainImage } from './tourpackage/entities/mainimage.entity';
// import { S3Module } from './s3/s3.module';
import { Installment } from './tourpackage/entities/installment.entity';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entity/booking.entity';
import { DepositModule } from './deposit_request/deposit.module';
import { Cheque } from './deposit_request/Entity/cheq.entity';
import { Cash } from './deposit_request/Entity/cash.entity';
import { BankTransfer } from './deposit_request/Entity/BankTransfer.entity';
import { CardPayment } from './deposit_request/Entity/Cardpayment.entity';
import { Bkash } from './deposit_request/Entity/Bkash.entity';
import { MobileBanking } from './deposit_request/Entity/MobileBanking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal:true }),
    TypeOrmModule.forRoot({
    type:'mysql',
    host: '192.241.145.76',
    port: 3306,
    username: 'flyfarladies',
    password: 'F3r2r28AsiFzW8Ke',
    database: 'flyfarladies',
      entities: [User,
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
      synchronize: true,
    }),
    UserModule,
    TourpackageModule,
    TravellerModule,
    UsderProfileModule,
    // S3Module,
    ConfigModule,
    BookingModule,
    DepositModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}





// LOCAL HOST
// host: '192.241.145.76',
// port: 3306,
// username: 'flyfarladies',
// password: 'F3r2r28AsiFzW8Ke',
// database: 'flyfarladies',