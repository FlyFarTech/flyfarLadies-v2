// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Cheque } from './Entity/cheq.entity';
// import { Repository } from 'typeorm';
// import { Cash } from './Entity/cash.entity';
// import { BankTransfer } from './Entity/BankTransfer.entity';
// import { CardPayment } from './Entity/Cardpayment.entity';
// import { Bkash } from './Entity/Bkash.entity';
// import { MobileBanking } from './Entity/MobileBanking.entity';

// @Injectable()
// export class DepositService {
//    constructor(
//       @InjectRepository(Cheque) private chequeRepository:Repository<Cheque>,
//       @InjectRepository(Cash) private CashRepository:Repository<Cash>,
//       @InjectRepository(BankTransfer) private BankTransferRepository:Repository<BankTransfer>,
//       @InjectRepository(CardPayment) private CardPaymentRepository:Repository<CardPayment>,
//       @InjectRepository(Bkash) private BkashPaymentRepository:Repository<Bkash>,
//       @InjectRepository(MobileBanking) private MobileBankingRepository:Repository<MobileBanking>,){}

//    async Findchequedeposit(id:string){
//       const cheque= await this.chequeRepository.findOne({where:{id}})
//       if (!cheque) {
//          throw new HttpException(
//            `No deposit found with this =${id}`,
//            HttpStatus.BAD_REQUEST,
//          );
//        }
//        return cheque;
//    }


//    async FindAllchequedeposit(){
//       const cheque= await this.chequeRepository.find({})
//       return cheque;
//    }

//    async FindCashdeposit(id:string){
//       const cash= await this.CashRepository.findOne({where:{id}})
//       if (!cash) {
//          throw new HttpException(
//            `No Cash deposit found with this =${id}`,
//            HttpStatus.BAD_REQUEST,
//          );
//        }
//        return cash;
//    }

//    async FindAllCashdeposit(){
//       const cash= await this.CashRepository.find({})
//        return cash;
//    }
   
//    async Findbankdeposit(id:string){
//       const bank= await this.BankTransferRepository.findOne({where:{id}})
//       if (!bank) {
//          throw new HttpException(
//            `No bank deposit found with this =${id}`,
//            HttpStatus.BAD_REQUEST,
//          );
//        }
//        return bank;
//    }

//    async FindAllCarddeposit(){
//       const bank= await this.CardPaymentRepository.find({})
//       return bank;
//    }


//    async FindCarddeposit(id:string){
//       const card= await this.CardPaymentRepository.findOne({where:{id}})
//       if (!card) {
//          throw new HttpException(
//            `No card deposit found with this =${id}`,
//            HttpStatus.BAD_REQUEST,
//          );
//        }
//        return card;
//    }

//    async FindAllbankdeposit(){
//       const bank= await this.BankTransferRepository.find({})
//       return bank;
//    }

   
//    async FindBkashdeposit(id:string){
//       const Bkash= await this.BkashPaymentRepository.findOne({where:{id}})
//       if (!Bkash) {
//          throw new HttpException(
//            `No Bkash deposit found with this =${id}`,
//            HttpStatus.BAD_REQUEST,
//          );
//        }
//        return Bkash;
//    }

//    async FindAllBkashdeposit(){
//       const Bkash= await this.BkashPaymentRepository.find({})
//       return Bkash;
//    }

   
//    async FindMobBankdeposit(id:string){
//       const MobBank= await this.MobileBankingRepository.findOne({where:{id}})
//       if (!MobBank) {
//          throw new HttpException(
//            `No Mobile Bank deposit found with this =${id}`,
//            HttpStatus.BAD_REQUEST,
//          );
//        }
//        return MobBank;
//    }

//    async FindAllmobilebankhdeposit(){
//       const mobilebank= await this.MobileBankingRepository.find({})
//       return mobilebank;
//    }


// }
