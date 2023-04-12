import { S3Module } from './../s3/s3.module';
import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entity/booking.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule,TypeOrmModule.forFeature([Tourpackage, Traveller, Booking]),S3Module],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
