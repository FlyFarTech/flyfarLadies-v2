
import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseFilePipeBuilder, ParseIntPipe, ParseUUIDPipe, Patch, Post, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from 'express';
import { Equal, FindOperator, Repository } from "typeorm";;
import { S3Service } from "src/s3/s3.service";
import { CreateUserDto } from "./Dto/user.dto";
import { User } from "./entitties/user.entity";
import { Cheque, PaymentStatus } from "./entitties/cheq.entity";
import { Cash } from "./entitties/cash.entity";
import { BankTransfer } from "./entitties/BankTransfer.entity";
import { CardPayment } from "./entitties/Cardpayment.entity";
import { Bkash } from "./entitties/Bkash.entity";
import { MobileBanking } from "./entitties/MobileBanking.enity";
import { profile } from "console";
import { UserServices } from "./userprofile.services";

@Controller('user')
export class userProfileController {
   constructor(@InjectRepository(User) private UserRepository: Repository<User>,
   @InjectRepository(Cheque) private chequeRepository:Repository<Cheque>,
     @InjectRepository(Cash) private CashRepository:Repository<Cash>,
     @InjectRepository(BankTransfer) private BankTransferRepository:Repository<BankTransfer>,
     @InjectRepository(CardPayment) private CardPaymentRepository:Repository<CardPayment>,
     @InjectRepository(Bkash) private BkashPaymentRepository:Repository<Bkash>,
     @InjectRepository(MobileBanking) private MobileBankingRepository:Repository<MobileBanking>,
      private readonly UserServices: UserServices,
      private s3service: S3Service
      ) {}

      @Post('Register')
      async Register(
         @Body() userDto:CreateUserDto,
         @Req() req: Request,
         @Res() res: Response){
         const ExistUser = await this.UserServices.getUserByEmail(userDto.Email)
         if(ExistUser){
            throw new HttpException("User Already Exist,please try again with another email", HttpStatus.BAD_REQUEST,);
         }
         await this.UserServices.Register(userDto)
         return res.status(HttpStatus.CREATED).json({ status:"success", message:'user register successfully'});
      }
      // User Login
      @Post('login')
      async login(@Body('Email') Email: string, @Body('Password') Password: string,  @Req() req: Request,
      @Res() res: Response){
         
        const token = await this.UserServices.login(Email,Password);
        return res.status(HttpStatus.CREATED).json({ status:"success", message:'user login successfully',jwtToken:token}); ;
      }
   
      // verify token
      @Post('verify')
      async verify(@Body('jwtToken') jwtToken: string): Promise<User> {
        const user = await this.UserServices.verifyToken(jwtToken);
        return user;
      }
   
   
   // Add Traveller
   @Patch('update/:uuid')
   @UseInterceptors(FileFieldsInterceptor([
      { name: 'PassportsizephotoUrl', maxCount: 2 },
      { name: 'passportphotoUrl', maxCount: 2 },
   ]))
   async updateProfile(
      @UploadedFiles()
      file: { PassportsizephotoUrl?: Express.Multer.File[], passportphotoUrl?: Express.Multer.File[] },
      @Body() body,
      @Param('uuid') uuid:string,
      @Req() req: Request,
      @Res() res: Response) {
      const PassportsizephotoUrl = await this.s3service.Addimage(file.PassportsizephotoUrl[0])
      const passportphotoUrl = await this.s3service.Addimage(file.passportphotoUrl[0])
      const userprofile =  await this.UserRepository.findOne({where:{uuid}})
      if (!userprofile) {
         throw new HttpException(
           `User profile not found`,
           HttpStatus.BAD_REQUEST,
         );
       }

       if (file.PassportsizephotoUrl && file.PassportsizephotoUrl.length > 0) {
         const passportSizePhotoUrl = await this.s3service.Addimage(file.PassportsizephotoUrl[0]);
         userprofile.PassportsizephotoUrl = passportSizePhotoUrl;
       }
     
       if (file.passportphotoUrl && file.passportphotoUrl.length > 0) {
         const passportPhotoUrl = await this.s3service.Addimage(file.passportphotoUrl[0]);
         userprofile.PassportCopy = passportPhotoUrl;
       }
       
      userprofile.PassportCopy = passportphotoUrl
      userprofile.PassportsizephotoUrl = PassportsizephotoUrl
      userprofile.NameTitle = req.body.NameTitle
      userprofile.FirstName = req.body.FirstName
      userprofile.LastName = req.body.LastName
      userprofile.DOB = req.body.DOB
      userprofile.Gender = req.body.Gender
      userprofile.Profession = req.body.Profession
      userprofile.Nationality = req.body.Nationality
      userprofile.Mobile = req.body.Mobile
      userprofile.Email = req.body.Email
      userprofile.Address = req.body.Address
      userprofile.NID = req.body.NID
      userprofile.PassportExpireDate = req.body.PassportExpireDate
      userprofile.PassportNumber = req.body.PassportNumber
      userprofile.FaceBookId = req.body.FaceBookId
      userprofile.LinkedIn = req.body.LinkedIn
      userprofile.WhatsApp = req.body.whatsApp
      await this.UserRepository.save({ ...userprofile })
      return res.status(HttpStatus.CREATED).json({ staus: "success", message: 'user Profile Added successfully' });
   }


   // all user

   @Get('AllProfile')
   async FindAll(
      @Req() req: Request,
      @Res() res: Response) {
      const Profile = await this.UserServices.FindAllProfile();
      return res.status(HttpStatus.OK).json({ Profile });
   }

   // // get user dashbboard
   @Get(':id')
   async UserDashboard(
      @Param('id') id: string,
      @Req() req: Request,
      @Res() res: Response) {
      const dashboard = await this.UserServices.FindProfile(id);
      return res.status(HttpStatus.OK).json({ dashboard });
   }


   @Delete(':id')
   async DeleteTraveller(
      @Param('id') id: string,
      @Req() req: Request,
      @Res() res: Response) {
      await this.UserServices.DeleteProfile(id)
      return res.status(HttpStatus.OK).json({ message: 'traveller has deleted' });
   }

   @Post(':Uid/:Id')
   async addToWishlist(
      @Param('Uid', new ParseUUIDPipe) Uid: string,
      @Param('Id', ParseIntPipe) Id: number,
   ) {
      return this.UserServices.addToWishlist(Uid, Id);
   }

   @Delete(':Uid/:Id')
   async removeFromWishlist(
      @Param('Uid', new ParseUUIDPipe) Uid: string,
      @Param('Id', ParseIntPipe) Id: number,
      @Res() res: Response,
   ) {
      await this.UserServices.removeFromWishlist(Uid, Id);
      return res.status(HttpStatus.OK).json({
         status: "success",
         message: `Wishlist has removed`,
      });
   }

   @Get(':Uid')
   async getWishlist(@Param('Uid', new ParseUUIDPipe) Uid: string) {
      return this.UserServices.getWishlist(Uid);
   }


   //cheque details
   @Post(":uuid/Addcheque/deposit")
   @UseInterceptors(
     FileInterceptor('chequeattachmenturl')
   )
   async AddCheque(
   @Param('uuid', ParseUUIDPipe) uuid: string,
   @UploadedFile()
   file: Express.Multer.File,
   @Req() req: Request,
   @Res() res: Response)  {
      const Profile = await this.UserRepository.findOne({ where: { uuid } });
      if (!Profile) {
         throw new HttpException("Profile not found", HttpStatus.BAD_REQUEST);
      }
      const chequeattachmenturl = await this.s3service.Addimage(file)
      const cheque = new Cheque();
      cheque.chequeattachmenturl =chequeattachmenturl;
      cheque.ChequeNumber =req.body.ChequeNumber;
      cheque.BankName =req.body.BankName;
      cheque.ChequeDate =req.body.ChequeDate;
      cheque.Reference =req.body.Reference;
      cheque.Amount=parseFloat(req.body.Amount)
      cheque.userprofile =Profile;
      await this.chequeRepository.save(cheque);
      return res.status(HttpStatus.OK).send({ status: "success", message: " Cheque Deposit Request Successfull",cheque })     
   }

   @Patch('cheques/:cheqdepoid/approve')
   async approveCheque(
   @Param('cheqdepoid') cheqdepoid: string,
   @Body('uuid') uuid:string,
   @Res() res: Response

   ) {
   const cheque = await this.chequeRepository.findOne({where:{cheqdepoid}})
   if (!cheque) {
      throw new NotFoundException('Cheque not found');
   }
   if(cheque.status !== PaymentStatus.PENDING)
   {
       throw new NotFoundException('Deposit request already approved or Rejected');
   }
   const profile = await this.UserRepository.findOne({ where: {uuid} });
   if (!profile) {
      throw new NotFoundException('user not found');
   }
   cheque.status =  PaymentStatus.APPROVED
   await this.chequeRepository.save(cheque);
   profile.Wallet += cheque.Amount;
   await this.UserRepository.save(profile);
   return res.status(HttpStatus.OK).send({ status: "success", message: " Deposit Request approved"})
   }

   @Patch('cheques/:cheqdepoid/reject')
   async rejectCheque(
   @Param('cheqdepoid') cheqdepoid: string,
   @Body() body: { reason: string },
   @Req() req: Request,
   @Res() res: Response
   ){
   const cheque = await this.chequeRepository.findOne({where:{cheqdepoid}})
   if (!cheque) {
      throw new NotFoundException('Cheque not found');
   }
   if(cheque.status !== PaymentStatus.PENDING)
   {
      throw new NotFoundException('Deposit request already rejected or approved');
   }
   cheque.status =  PaymentStatus.REJECTED
   cheque.rejectionReason = `Rejected due to ${body.reason}`;
   if(!body.reason){
      throw new NotFoundException('please add reason');
   }
   await this.chequeRepository.save(cheque);
   return res.status(HttpStatus.OK).send({ status: "success", message: " Deposit Request Rejected"})
   }
  
   @Get('cheques/pending')
   async PendingChequeDeposit(): Promise<Cheque[]> {
      const status: PaymentStatus = PaymentStatus.PENDING;
   return await this.chequeRepository.find({where:{status:  Equal(PaymentStatus.PENDING)}});
   }

     // get refund policy
  @Get(':uuid/getcheque/:cheqdepoid')
  async getchequeDeporequest(
    @Param('uuid') uuid: string,
    @Param('cheqdepoid') cheqdepoid: string,
    @Req() req: Request,
    @Res() res: Response) {
    const chequeDeposit= await this.UserServices.GetCheqDepo(uuid, cheqdepoid)
    return res.status(HttpStatus.OK).json({ chequeDeposit });
  }


   @Get('cheques/approved')
   async ApprovedChequeDeposit(): Promise<Cheque[]> {
      const status: PaymentStatus = PaymentStatus.APPROVED;
   return await this.chequeRepository.find({where:{status:  Equal(PaymentStatus.APPROVED)}});
   }

   @Get('cheques/reject')
   async rejectChequeDeposit(): Promise<Cheque[]> {
      const status: PaymentStatus = PaymentStatus.REJECTED;
   return await this.chequeRepository.find({where:{status:  Equal(PaymentStatus.REJECTED)}});
   }

   //mobileBank details

   @Post(':uuid/mobilebanking/deposit')
   @UseInterceptors(
     FileInterceptor('MobBankattachmenturl'),
   )
   async addmobilebankinbg( @UploadedFile()
   file: Express.Multer.File,
   @Param('uuid') uuid: string,
   @Req() req: Request,
   @Res() res: Response) {
      const Profile = await this.UserRepository.findOne({ where: { uuid } });
      if (!Profile) {
         throw new HttpException("Profile not found", HttpStatus.BAD_REQUEST);
      }
      const MobBankattachmenturl = await this.s3service.Addimage(file)
      const MobileBank = new MobileBanking();
      MobileBank.MobBankattachmenturl =MobBankattachmenturl
      MobileBank.AgentType =req.body.AgentType
      MobileBank.AccountNumber =req.body.AccountNumber
      MobileBank.Reference =req.body.Reference
      MobileBank.TransactionId =req.body.TransactionId
      MobileBank.Amount =parseFloat(req.body.Amount)
      const amount = MobileBank.Amount
      MobileBank.Amount =amount
      const fee = amount*1.5/100
      MobileBank.GatewayFee =fee
      const depositedAmount=amount-fee
      MobileBank.DepositedAmount =depositedAmount
      MobileBank.userprofile =Profile;
      await this.MobileBankingRepository.save(MobileBank)
      return res.status(HttpStatus.OK).send({ status: "success", message: " Mobile Banking Deposit Request Successfull", })
   }
      @Patch('mobilebank/:mobbankid/approve')
      async ApproveMobile(
      @Param('mobbankid') mobbankid: string,
      @Body('uuid') uuid:string,
      @Req() req: Request,
      @Res() res: Response

      ) {
      const mobnank = await this.MobileBankingRepository.findOne({where:{mobbankid}})
      if (!mobnank) {
         throw new NotFoundException('Deposit not found');
      }
      if(mobnank.status !== PaymentStatus.PENDING)
      {
            throw new NotFoundException('Deposit request already approved or Rejected');
      }
      const profile = await this.UserRepository.findOne({ where: {uuid} });
      if (!profile) {
         throw new NotFoundException('user not found');
      }
      mobnank.status =  PaymentStatus.APPROVED
      await this.MobileBankingRepository.save(mobnank);
      profile.Wallet += mobnank.Amount;
      await this.UserRepository.save(profile);
      return res.status(HttpStatus.OK).send({ status: "success", message: " Deposit Request approved"})
      }


      @Patch('mobilebank/:mobbankid/reject')
      async RejectMobilebankDeposit (
      @Param('mobbankid') mobbankid: string,
      @Body() body: { reason: string },
      @Req() req: Request,
      @Res() res: Response
      ){
      const mobilebank = await this.MobileBankingRepository.findOne({where:{mobbankid}})
      if (!mobilebank) {
         throw new NotFoundException('Deposit not found');
      }
      if(mobilebank.status !== PaymentStatus.PENDING)
      {
         throw new NotFoundException('Deposit request already rejected or approved');
      }
      mobilebank.status =  PaymentStatus.REJECTED
      mobilebank.rejectionReason = `Rejected due to ${body.reason}`;
      if(!body.reason){
         throw new NotFoundException(' please add reason');
      }
      await this.MobileBankingRepository.save(mobilebank);
      return res.status(HttpStatus.OK).send({ status: "success", message: " Deposit Request Rejected"})
      }

      
   @Get('mobilebank/pending')
   async PendingMobileBankDeposit(): Promise<MobileBanking[]> {
      const status: PaymentStatus = PaymentStatus.PENDING;
   return await this.MobileBankingRepository.find({where:{status:  Equal(PaymentStatus.PENDING)}});
   }


   @Get('mobilebank/approved')
   async ApprovedmobilebankDeposit(): Promise<MobileBanking[]> {
      const status: PaymentStatus = PaymentStatus.APPROVED;
   return await this.MobileBankingRepository.find({where:{status:  Equal(PaymentStatus.APPROVED)}});
   }

   @Get('mobilebank/reject')
   async rejectmobilebankDeposit(): Promise<MobileBanking[]> {
      const status: PaymentStatus = PaymentStatus.REJECTED;
   return await this.MobileBankingRepository.find({where:{status:  Equal(PaymentStatus.REJECTED)}});
   }



   @Post(':uuid/bank/deposit')
   @UseInterceptors(
      FileInterceptor('Bankattachmenturl'),
   )
   async addBankDeposit( @UploadedFile()
   file: Express.Multer.File,
   @Param('uuid') uuid: string,
   @Req() req: Request,
   @Res() res: Response) {
      const Profile = await this.UserRepository.findOne({ where: { uuid } });
      if (!Profile) {
         throw new HttpException("Profile not found", HttpStatus.BAD_REQUEST);
      }
      const Bankattachmenturl = await this.s3service.Addimage(file)
      const Banktransfer = new BankTransfer();
      Banktransfer.Bankattachmenturl =Bankattachmenturl
      Banktransfer.DepositFrom = req.body.DepositFrom
      Banktransfer.DepositTo = req.body.DepositTo
      Banktransfer.ChequeDate =req.body.ChequeDate
      Banktransfer.TransactionId =req.body.TransactionId
      Banktransfer.Amount =parseFloat(req.body.Amount)
      Profile.Wallet += Banktransfer.Amount
      Banktransfer.userprofile =Profile;
      await this.BankTransferRepository.save({...Banktransfer})
      await this.UserRepository.save(Profile)
      return res.status(HttpStatus.OK).send({ status: "success", message: " Banktransfer Deposit Request Successfull", })
   }

      @Patch('bank/:bankdepoid/approve')
      async ApproveBankDepo(
      @Param('	bankdepoid') 	bankdepoid: string,
      @Body('uuid') uuid:string,
      @Req() req: Request,
      @Res() res: Response
      ) {
      const bank = await this.BankTransferRepository.findOne({where:{bankdepoid}})
      if (!bank) {
         throw new NotFoundException('Deposit not found');
      }
      if(bank.status !== PaymentStatus.PENDING)
      {
         throw new NotFoundException('Deposit request already approved or Rejected');
      }
      const profile = await this.UserRepository.findOne({ where: {uuid} });
      if (!profile) {
         throw new NotFoundException('user not found');
      }
      bank.status =  PaymentStatus.APPROVED
      await this.BankTransferRepository.save(bank);
      profile.Wallet += bank.Amount;
      await this.UserRepository.save(profile);
      return res.status(HttpStatus.OK).send({ status: "success", message:" Deposit Request approved"})
      }


      @Patch('bank/:bankdepoid/reject')
      async RejectbankDeposit (
      @Param('bankdepoid') bankdepoid: string,
      @Body() body: { reason: string },
      @Req() req: Request,
      @Res() res: Response
      ){
      const bank = await this.BankTransferRepository.findOne({where:{bankdepoid}})
      if (!bank) {
         throw new NotFoundException('Deposit not found');
      }
      if(bank.status !== PaymentStatus.PENDING)
      {
         throw new NotFoundException('Deposit request already rejected or approved');
      }
      bank.status =  PaymentStatus.REJECTED
   
      bank.rejectionReason = `Rejected due to ${body.reason}`;
      if(!body.reason){
         throw new NotFoundException(' please add reason');
      }
      await this.BankTransferRepository.save(bank);
      return res.status(HttpStatus.OK).send({ status: "success", message: " Deposit Request Rejected"})
      }

      @Get('bank/pending')
      async PendingBankDeposit(): Promise<BankTransfer[]> {
         const status: PaymentStatus = PaymentStatus.PENDING;
      return await this.BankTransferRepository.find({where:{status:  Equal(PaymentStatus.PENDING)}});
      }
   
   
      @Get('bank/approved')
      async ApprovebankDeposit(): Promise<BankTransfer[]> {
         const status: PaymentStatus = PaymentStatus.APPROVED;
      return await this.BankTransferRepository.find({where:{status:  Equal(PaymentStatus.APPROVED)}});
      }
   
      @Get('bank/reject')
      async rejectbankDeposit(): Promise<BankTransfer[]> {
         const status: PaymentStatus = PaymentStatus.REJECTED;
      return await this.BankTransferRepository.find({where:{status:  Equal(PaymentStatus.REJECTED)}});
      }

}