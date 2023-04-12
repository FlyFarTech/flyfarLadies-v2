import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cheque } from './Entity/cheq.entity';
// import { S3Module } from 'src/s3/s3.module';
import { Cash } from './Entity/cash.entity';
import { BankTransfer } from './Entity/BankTransfer.entity';
import { CardPayment } from './Entity/Cardpayment.entity';
import { Bkash } from './Entity/Bkash.entity';
import { MobileBanking } from './Entity/MobileBanking.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cheque,Cash, BankTransfer, CardPayment, Bkash, MobileBanking])],
  controllers: [DepositController],
  providers: [DepositService]
})
export class DepositModule {}
