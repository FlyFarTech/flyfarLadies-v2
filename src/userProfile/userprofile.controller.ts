
import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseFilePipeBuilder, ParseIntPipe, ParseUUIDPipe, Patch, Post, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from 'express';
import { Equal, Repository } from "typeorm";;
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
import { Tourpackage } from "src/tourpackage/entities/tourpackage.entity";
import { Traveller } from "src/Traveller/entities/traveller.entity";
import { title } from "process";

@Controller('user')
export class userProfileController {
   constructor(@InjectRepository(User) private UserRepository: Repository<User>,
   @InjectRepository(Cheque) private chequeRepository:Repository<Cheque>,
     @InjectRepository(Cash) private CashRepository:Repository<Cash>,
     @InjectRepository(BankTransfer) private BankTransferRepository:Repository<BankTransfer>,
     @InjectRepository(CardPayment) private CardPaymentRepository:Repository<CardPayment>,
     @InjectRepository(Bkash) private BkashPaymentRepository:Repository<Bkash>,
     @InjectRepository(MobileBanking) private MobileBankingRepository:Repository<MobileBanking>,
     @InjectRepository(Traveller) private TravellerRepository:Repository<Traveller>,
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

   @Post(':id/addtraveler')
   @UseInterceptors(FileFieldsInterceptor([
      { name: 'passportphotoUrl', maxCount: 2 },
   ]))
      async addTraveler(
         @UploadedFiles()
         file:{passportphotoUrl?: Express.Multer.File[] },
         @Param('uuid') uuid: string,
         @Res() res: Response,
         @Req() req: Request,
         @Body() body: { travelers: any[]}) {
         const user = await this.UserRepository.findOne({where:{uuid}});
   
         const travelers = [];
         const Passportcopy = await this.s3service.Addimage(file.passportphotoUrl[0])
         let travelerDataArray =body.travelers;

         if (!Array.isArray(travelerDataArray)) {
          travelerDataArray = [travelerDataArray];
        }
    
      for (const travelerData of travelerDataArray){
         if(travelerData){
            const {Title, FirstName, LastName, Nationality, DOB, Gender, PaxType,PassportNumber,PassportExpireDate}=travelerData
            const traveler = new Traveller();
            traveler.Title = Title
            traveler.FirstName = FirstName
            traveler.LastName = LastName
            traveler.Nationality = Nationality
            traveler.Gender = Gender
            traveler.PaxType = PaxType
            traveler.DOB = DOB
            traveler.PassportNumber =PassportNumber
            traveler.PassportExpireDate =PassportExpireDate
            traveler.PassportCopyURL =Passportcopy
            traveler.user = user;
            travelers.push(traveler)
            }
         }
         await this.TravellerRepository.save({ ...travelers})
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

   @Post(':uuid/wishlist')
   async addToWishlist(
      @Param('uuid',) uuid: string,
      @Body() tourpackage: Promise<Tourpackage>
   ) {
      // return this.UserServices.addToWishlist(uuid,tourpackage);
   }

   @Delete(':uuid')
   async removeFromWishlist(
      @Param('Uid', new ParseUUIDPipe) Uid: string,
      @Param('FFLPKID') FFLPKID: string,
      @Res() res: Response,
   ) {
      await this.UserServices.removeFromWishlist(Uid, FFLPKID);
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
   @Post(":uuid/Add/cheque/deposit")
   @UseInterceptors(
     FileInterceptor('chequeattachmenturl')
   )
   async AddCheque(
   @Param('uuid') uuid: string,
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
      cheque.DepositType =req.body.DepositType;
      cheque.ChequeDate =req.body.ChequeDate;
      cheque.Reference =req.body.Reference;
      cheque.Amount=parseFloat(req.body.Amount)
      cheque.userprofile =Profile;
      cheque.uuid =Profile.uuid
      await this.chequeRepository.save(cheque);
      return res.status(HttpStatus.OK).send({ status: "success", message: " Cheque Deposit Request Successfull",cheque })     
   }

   @Patch('Cheque/:Depositid/approve')
   async approveCheque(
   @Param('Depositid') Depositid: string,
   @Body('uuid') uuid:string,
   @Body() body:{ActionBy:string},
   @Res() res: Response,
   @Req() req: Request

   ) {
   const cheque = await this.chequeRepository.findOne({where:{Depositid}})
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
   cheque.ActionBy =`Approved By ${body.ActionBy}`
   if(!body.ActionBy){
      throw new NotFoundException('ActionBy');
   }
   await this.chequeRepository.save(cheque);
   profile.Wallet += cheque.Amount;
   await this.UserRepository.save(profile);
   return res.status(HttpStatus.OK).send({ status: "success", message: " Deposit Request approved"})
   }

   @Patch('Cheque/:Depositid/reject')
   async rejectCheque(
   @Param('Depositid') Depositid: string,
   @Body() body: { rejectionReason: string , ActionBy: string},
   @Req() req: Request,
   @Res() res: Response
   ){
   const cheque = await this.chequeRepository.findOne({where:{Depositid}})
   if (!cheque) {
      throw new NotFoundException('Cheque not found');
   }
   if(cheque.status !== PaymentStatus.PENDING)
   {
      throw new NotFoundException('Deposit request already rejected or approved');
   }
   cheque.status =  PaymentStatus.REJECTED
   cheque.ActionBy =`Action by ${body.ActionBy}` 
   if(!body.ActionBy){
      throw new NotFoundException('Action by??');
   }
   cheque.rejectionReason = `Rejected due to ${body.rejectionReason}`;
   if(!body.rejectionReason){
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
  @Get(':uuid/getcheque/:Depositid')
  async getchequeDeporequest(
    @Param('uuid') uuid: string,
    @Param('Depositid') Depositid: string,
    @Req() req: Request,
    @Res() res: Response) {
    const chequeDeposit= await this.UserServices.GetCheqDepo(uuid, Depositid)
    return res.status(HttpStatus.OK).json({ chequeDeposit });
  }

  @Get(':uuid/allchequeDeposit')
  async AllChequeDeposit(
    @Param('uuid') uuid: string,
    @Req() req: Request,
    @Res() res: Response) {
    const AllChequeDeposit= await this.UserServices.AllCheqDepo(uuid)
    return res.status(HttpStatus.OK).json({ AllChequeDeposit });
  }

  @Get(':uuid/allDeposit')
  async AllDeposit(
    @Param('uuid') uuid: string,
    @Req() req: Request,
    @Res() res: Response) {
    const AllDeposit= await this.UserServices.AllDeposit(uuid)
    return res.status(HttpStatus.OK).json({ AllDeposit });
  }

  @Get('allDeposit/request')
  async allDepositrequest(
    @Param('uuid') uuid: string,
    @Req() req: Request,
    @Res() res: Response) {
    const AllDeposit= await this.UserServices.AllDepositRequest()
    return res.status(HttpStatus.OK).json({ AllDeposit });
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
      MobileBank.DepositType =req.body.DepositType;
      MobileBank.TransactionId =req.body.TransactionId
      MobileBank.Amount =parseFloat(req.body.Amount)
      const amount = MobileBank.Amount
      MobileBank.Amount =amount
      const fee = amount*1.5/100
      MobileBank.GatewayFee =fee
      const depositedAmount=amount-fee
      MobileBank.DepositedAmount =depositedAmount
      MobileBank.userprofile =Profile;
      MobileBank.uuid =Profile.uuid
      await this.MobileBankingRepository.save(MobileBank)
      return res.status(HttpStatus.OK).send({ status: "success", message: " Mobile Banking Deposit Request Successfull", })
   }
      @Patch('MobileBank/:Depositid/approve')
      async ApproveMobile(
      @Param('Depositid') Depositid: string,
      @Body('uuid') uuid:string,
      @Body() body: { ActionBy: string },
      @Req() req: Request,
      @Res() res: Response

      ) {
      const mobnank = await this.MobileBankingRepository.findOne({where:{Depositid}})
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
      mobnank.ActionBy = `Approved By ${body.ActionBy}`
      if (!body.ActionBy) {
         throw new NotFoundException('Action By?');
      }
      await this.MobileBankingRepository.save(mobnank);
      profile.Wallet += mobnank.Amount;
      await this.UserRepository.save(profile);
      return res.status(HttpStatus.OK).send({ status: "success", message: " Deposit Request approved"})
      }

      @Patch('MobileBank/:Depositid/reject')
      async RejectMobilebankDeposit (
      @Param('Depositid') Depositid: string,
      @Body() body: { ActionBy: string, rejectionReason:string },
      @Req() req: Request,
      @Res() res: Response
      ){
      const mobilebank = await this.MobileBankingRepository.findOne({where:{Depositid}})
      if (!mobilebank) {
         throw new NotFoundException('Deposit not found');
      }
      if(mobilebank.status !== PaymentStatus.PENDING)
      {
         throw new NotFoundException('Deposit request already rejected or approved');
      }
      mobilebank.status =  PaymentStatus.REJECTED
      mobilebank.ActionBy=`Action By ${body.ActionBy}`
      if(!body.ActionBy){
         throw new NotFoundException('Action By?');
      }
      mobilebank.rejectionReason = `Rejected due to ${body.rejectionReason}`;
      if(!body.rejectionReason){
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
      const Banktransfer = new BankTransfer()
      Banktransfer.Bankattachmenturl =Bankattachmenturl
      Banktransfer.DepositFrom = req.body.DepositFrom
      Banktransfer.DepositTo = req.body.DepositTo
      Banktransfer.DepositType = req.body.DepositType
      Banktransfer.ChequeDate =req.body.ChequeDate
      Banktransfer.TransactionId =req.body.TransactionId
      Banktransfer.Amount =parseFloat(req.body.Amount)
      Profile.Wallet += Banktransfer.Amount
      Banktransfer.userprofile =Profile;
      Banktransfer.uuid =Profile.uuid
      await this.BankTransferRepository.save({...Banktransfer})
      await this.UserRepository.save(Profile)
      return res.status(HttpStatus.OK).send({ status: "success", message: " Banktransfer Deposit Request Successfull", })
   }

      @Patch('Bank/:Depositid/approve')
      async ApproveBankDepo(
      @Param('Depositid') 	Depositid: string,
      @Body('uuid') uuid:string,
      @Body() body:{ActionBy:string},
      @Req() req: Request,
      @Res() res: Response
      ) {
      const bank = await this.BankTransferRepository.findOne({where:{Depositid}})
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
      bank.ActionBy =`Approved By ${body.ActionBy}`
      if (!body.ActionBy) {
         throw new NotFoundException('Action By');
      }
      await this.BankTransferRepository.save(bank);
      profile.Wallet += bank.Amount;
      await this.UserRepository.save(profile);
      return res.status(HttpStatus.OK).send({ status: "success", message:" Deposit Request approved"})
      }


      @Patch('Bank/:Depositid/reject')
      async RejectbankDeposit (
      @Param('Depositid') Depositid: string,
      @Body() body: { ActionBy: string ,rejectionReason:string},
      @Req() req: Request,
      @Res() res: Response
      ){
      const bank = await this.BankTransferRepository.findOne({where:{Depositid}})
      if (!bank) {
         throw new NotFoundException('Deposit not found');
      }
      if(bank.status !== PaymentStatus.PENDING)
      {
         throw new NotFoundException('Deposit request already rejected or approved');
      }
      bank.status =  PaymentStatus.REJECTED
      bank.ActionBy =`Approved By ${body.ActionBy}`
      if(!body.ActionBy){
         throw new NotFoundException('Action By?');
      }
      bank.rejectionReason = `Rejected due to ${body.rejectionReason}`;
      if(!body.rejectionReason){
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