import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cheque } from './Entity/cheq.entity';
import { Cash } from './Entity/cash.entity';
import { BankTransfer } from './Entity/BankTransfer.entity';
import { CardPayment } from './Entity/Cardpayment.entity';
import { Bkash } from './Entity/Bkash.entity';
import { MobileBanking } from './Entity/MobileBanking.entity';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports:[TypeOrmModule.forFeature([Cheque,Cash, BankTransfer, CardPayment, Bkash, MobileBanking]), S3Module],
  controllers: [DepositController],
  providers: [DepositService]
})
export class DepositModule {}
