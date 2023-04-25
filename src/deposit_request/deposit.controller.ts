// import { Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { DepositService } from './deposit.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { S3Service } from 'src/s3/s3.service';
// import { Cheque } from './Entity/cheq.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Request, Response } from 'express';
// import { Cash } from './Entity/cash.entity';
// import { BankTransfer } from './Entity/BankTransfer.entity';
// import { CardPayment } from './Entity/Cardpayment.entity';
// import { Bkash } from './Entity/Bkash.entity';
// import { MobileBanking } from './Entity/MobileBanking.entity';

// @Controller('depositrequest')
// export class DepositController {
//   constructor(
//   @InjectRepository(Cheque) private chequeRepository:Repository<Cheque>,
//   @InjectRepository(Cash) private CashRepository:Repository<Cash>,
//   @InjectRepository(BankTransfer) private BankTransferRepository:Repository<BankTransfer>,
//   @InjectRepository(CardPayment) private CardPaymentRepository:Repository<CardPayment>,
//   @InjectRepository(Bkash) private BkashPaymentRepository:Repository<Bkash>,
//   @InjectRepository(MobileBanking) private MobileBankingRepository:Repository<MobileBanking>,
//   private readonly depositService: DepositService,
//   private s3service: S3Service
//   ) {}
  
//   @Post('Addchequedeposit')
//   @UseInterceptors(
//     FileInterceptor('chequeattachmenturl'),
//   )
//   async ChequeDeposit(
//     @UploadedFile()
//     file: Express.Multer.File,
//     @Req() req: Request,
//     @Res() res: Response) {
//     const chequeattachmenturl = await this.s3service.Addimage(file)
//     const cheque = new Cheque();
//     cheque.chequeattachmenturl =chequeattachmenturl
//     cheque.ChequeNumber =req.body.ChequeNumber
//     cheque.BankName =req.body.BankName
//     cheque.ChequeDate =req.body.ChequeDate
//     cheque.Reference =req.body.Reference
//     cheque.Amount=req.body.Amount
//     await this.chequeRepository.save(cheque)
//     return res.status(HttpStatus.OK).send({ status: "success", message: " Cheque Deposit Request Successfull", })
//   }


//   @Get('getchequedeposit/:id')
//   async getchequedeposit(
//     @Param('id') id:string,
//     @Req() req: Request,
//     @Res() res: Response
//     ){
//     const chequedeposit= await this.depositService.Findchequedeposit(id)
//     return res.status(HttpStatus.OK).json({chequedeposit})
//   }

//   @Get('allchequedeposit')
//   async getAllchequedeposit(
//     @Req() req: Request,
//     @Res() res: Response
//     ){
//     const Allchequedeposit= await this.depositService.FindAllchequedeposit()
//     return res.status(HttpStatus.OK).json({Allchequedeposit})
//   }

  
//   @Post('Addcashdeposit')
//   @UseInterceptors(
//     FileInterceptor('cashattachmenturl'),
//   )
//   async cashdeposit(
//     @UploadedFile()
//     file: Express.Multer.File,
//     @Req() req: Request,
//     @Res() res: Response) {
//     const cashattachmenturl = await this.s3service.Addimage(file)
//     const cash = new Cash();
//     cash.cashattachmenturl =cashattachmenturl
//     cash.Name = req.body.Name
//     cash.ReceiverName = req.body.ReceiverName
//     cash.Reference =req.body.Reference
//     cash.Amount=req.body.Amount
//     await this.CashRepository.save(cash)
//     return res.status(HttpStatus.OK).send({ status: "success", message: " Cash Deposit Request Successfull", })
//   }

  
//   @Get('getcashdeposit/:id')
//   async getcashdeposit(
//     @Param('id') id:string,
//     @Req() req: Request,
//     @Res() res: Response
//     ){
//     const cashdeposit= await this.depositService.FindCashdeposit(id)
//     return res.status(HttpStatus.OK).json({cashdeposit})
//   }

//   @Get('allcashdeposit')
//   async getAllCashdeposit(
//     @Req() req: Request,
//     @Res() res: Response
//     ){
//     const Allcashdeposit= await this.depositService.FindAllCashdeposit()
//     return res.status(HttpStatus.OK).json({Allcashdeposit})
//   }

// // Bank Transfer
//   @Post('AddBankdeposit')
//   @UseInterceptors(
//     FileInterceptor('Bankattachmenturl'),
//   )
//   async BankDeposit(
//     @UploadedFile()
//     file: Express.Multer.File,
//     @Req() req: Request,
//     @Res() res: Response) {
//     const Bankattachmenturl = await this.s3service.Addimage(file)
//     const Banktransfer = new BankTransfer();
//     Banktransfer.Bankattachmenturl =Bankattachmenturl
//     Banktransfer.DepositFrom = req.body.DepositFrom
//     Banktransfer.DepositTo = req.body.DepositTo
//     Banktransfer.ChequeDate =req.body.ChequeDate
//     Banktransfer.TransactionId =req.body.TransactionId
//     Banktransfer.Amount =req.body.Amount
//     await this.BankTransferRepository.save(Banktransfer)
//     return res.status(HttpStatus.OK).send({ status: "success", message: " Banktransfer Deposit Request Successfull", })
//   }

//   @Get('getbankdeposit/:id')
//   async getbankdeposit(
//     @Param('id') id:string,
//     @Req() req: Request,
//     @Res() res: Response
//     ){
//     const cashdeposit= await this.depositService.Findbankdeposit(id)
//     return res.status(HttpStatus.OK).json({cashdeposit})
//   }

//   @Get('allbankdeposit')
//   async getAllbankdeposit(
//     @Req() req: Request,
//     @Res() res: Response
//     ){
//     const Allcashdeposit= await this.depositService.FindAllbankdeposit()
//     return res.status(HttpStatus.OK).json({Allcashdeposit})
//   }

//   //Card Paymemnt

//   @Post('carddeposit')
//   async CardPaymentDeposit(
//     @Req() req: Request,
//     @Res() res: Response) {
//     const Cardpayment = new CardPayment();
//     Cardpayment.Amount =req.body.Amount
//     const amount = Cardpayment.Amount
//     if(amount<100){
//       throw new HttpException(
//         `Minimum deposit 100TK`,
//         HttpStatus.BAD_REQUEST,
//       );    
//     }
//     Cardpayment.Amount =amount
//     const fee = amount*2.2/100
//     Cardpayment.GatewayFee =fee
//     const depositedAmount=amount-fee
//     Cardpayment.DepositedAmount =depositedAmount
//     await this.CardPaymentRepository.save(Cardpayment)
//     return res.status(HttpStatus.OK).send({ status: "success", message: " Card  Deposit Request Successfull", })
//     }




//     @Get('getcarddeposit/:id')
//     async getcarddeposit(
//       @Param('id') id:string,
//       @Req() req: Request,
//       @Res() res: Response
//       ){
//       const getcarddeposit= await this.depositService.FindCarddeposit(id)
//       return res.status(HttpStatus.OK).json({getcarddeposit})
//     }
  
//     @Get('allcarddeposit')
//     async allcarddeposit(
//       @Req() req: Request,
//       @Res() res: Response
//       ){
//       const allcarddeposit= await this.depositService.FindAllCarddeposit()
//       return res.status(HttpStatus.OK).json({allcarddeposit})
//     }


    
//   @Post('bkashdeposit')
//   @UseInterceptors(
//     FileInterceptor('chequeattachmenturl'),
//   )
//   async bkashdeposit(
//     @Req() req: Request,
//     @Res() res: Response) {
//     const Bkashdeposit = new Bkash();
//     Bkashdeposit.Amount =req.body.Amount
//     const amount = Bkashdeposit.Amount
//     if(amount<20){
//       throw new HttpException(
//         `Minimum deposit 20TK`,
//         HttpStatus.BAD_REQUEST,
//       );    
//     }
//     Bkashdeposit.Amount =amount
//     const fee = amount*1.5/100
//     Bkashdeposit.GatewayFee =fee
//     const depositedAmount=amount-fee
//     Bkashdeposit.DepositedAmount =depositedAmount
//     await this.BkashPaymentRepository.save(Bkashdeposit)
//     return res.status(HttpStatus.OK).send({ status: "success", message: " Bkash Deposit Request Successfull", })
//     }


//     @Get('getBkashdeposit/:id')
//     async getBkashdeposit(
//       @Param('id') id:string,
//       @Req() req: Request,
//       @Res() res: Response
//       ){
//       const Bkash= await this.depositService.FindBkashdeposit(id)
//       return res.status(HttpStatus.OK).json({Bkash})
//     }
  
//     @Get('allbkashdeposit')
//     async allBkashdeposit(
//       @Req() req: Request,
//       @Res() res: Response
//       ){
//       const allBkashdeposit= await this.depositService.FindAllBkashdeposit()
//       return res.status(HttpStatus.OK).json({allBkashdeposit})
//     }


       
//   @Post('MobileBankdeposit')
//   @UseInterceptors(
//     FileInterceptor('MobBankattachmenturl'),
//   )
//   async MobileBankdeposit(
//     @UploadedFile()
//     file: Express.Multer.File,
//     @Req() req: Request,
//     @Res() res: Response) {
//     const MobBankattachmenturl = await this.s3service.Addimage(file)
//     const MobileBank = new MobileBanking();
//     MobileBank.MobBankattachmenturl =MobBankattachmenturl
//     MobileBank.AgentType =req.body.AgentType
//     MobileBank.AccountNumber =req.body.AccountNumber
//     MobileBank.Reference =req.body.Reference
//     MobileBank.TransactionId =req.body.TransactionId
//     MobileBank.Amount =req.body.Amount
//     const amount = MobileBank.Amount
//     MobileBank.Amount =amount
//     const fee = amount*1.5/100
//     MobileBank.GatewayFee =fee
//     const depositedAmount=amount-fee
//     MobileBank.DepositedAmount =depositedAmount
//     await this.MobileBankingRepository.save(MobileBank)
//     return res.status(HttpStatus.OK).send({ status: "success", message: " Mobile Banking Deposit Request Successfull", })
//     }


//     @Get('MobileBankdeposit/:id')
//     async getMobileBankdeposit(
//       @Param('id') id:string,
//       @Req() req: Request,
//       @Res() res: Response
//       ){
//       const mobilebanking= await this.depositService.FindMobBankdeposit(id)
//       return res.status(HttpStatus.OK).json({mobilebanking})
//     }
  
//     @Get('allmobilebankingdeposit')
//     async allmobilebankingdeposit(
//       @Req() req: Request,
//       @Res() res: Response
//       ){
//       const mobilebanking= await this.depositService.FindAllmobilebankhdeposit()
//       return res.status(HttpStatus.OK).json({mobilebanking})
//     }





// }
