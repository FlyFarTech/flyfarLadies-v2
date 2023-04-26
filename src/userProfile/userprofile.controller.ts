import { Userprofile } from 'src/userProfile/entitties/userprofile.entities';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, ParseUUIDPipe, Patch, Post, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from 'express';
import { Repository } from "typeorm";
import { updateUserProfileDto } from "./Dto/update-userprofile.dto";
import { UserProfileServices } from "./userprofile.services";
import { S3Service } from "src/s3/s3.service";
import { CreateUserDto } from "./Dto/user-login.dto";
import { User } from "./entitties/user-login.entity";
import { Cheque } from "./entitties/cheq.entity";
import { Cash } from "./entitties/cash.entity";
import { BankTransfer } from "./entitties/BankTransfer.entity";
import { CardPayment } from "./entitties/Cardpayment.entity";
import { Bkash } from "./entitties/Bkash.entity";
import { MobileBanking } from "./entitties/MobileBanking.enity";
import { profile } from "console";

@Controller('user')
export class userProfileController {
   constructor(@InjectRepository(Userprofile) private profileRepository: Repository<Userprofile>,
   @InjectRepository(Cheque) private chequeRepository:Repository<Cheque>,
     @InjectRepository(Cash) private CashRepository:Repository<Cash>,
     @InjectRepository(BankTransfer) private BankTransferRepository:Repository<BankTransfer>,
     @InjectRepository(CardPayment) private CardPaymentRepository:Repository<CardPayment>,
     @InjectRepository(Bkash) private BkashPaymentRepository:Repository<Bkash>,
     @InjectRepository(MobileBanking) private MobileBankingRepository:Repository<MobileBanking>,
      private readonly UserProfileServices: UserProfileServices,
      private s3service: S3Service
      ) {}

      @Post('Register')
      async Register(
         @Body() userDto:CreateUserDto,
         @Req() req: Request,
         @Res() res: Response){
         const ExistUser = await this.UserProfileServices.getUserByEmail(userDto.Email)
         if(ExistUser){
            throw new HttpException("User Already Exist,please try again with another email", HttpStatus.BAD_REQUEST,);
         }
         await this.UserProfileServices.Register(userDto)
         return res.status(HttpStatus.CREATED).json({ status:"success", message:'user register successfully'});
      }
      // User Login
      @Post('login')
      async login(@Body('Email') Email: string, @Body('Password') Password: string,  @Req() req: Request,
      @Res() res: Response){
         
        const token = await this.UserProfileServices.login(Email,Password);
        return res.status(HttpStatus.CREATED).json({ status:"success", message:'user login successfully',jwtToken:token}); ;
      }
   
      // verify token
      @Post('verify')
      async verify(@Body('jwtToken') jwtToken: string): Promise<User> {
        const user = await this.UserProfileServices.verifyToken(jwtToken);
        return user;
      }
   
   
   // Add Traveller
   @Post('addProfile')
   @UseInterceptors(FileFieldsInterceptor([
      { name: 'PassportsizephotoUrl', maxCount: 2 },
      { name: 'passportphotoUrl', maxCount: 2 },
   ]))
   async addProfile(
      @UploadedFiles()
      file: { PassportsizephotoUrl?: Express.Multer.File[], passportphotoUrl?: Express.Multer.File[] },
      @Body() body,
      @Req() req: Request,
      @Res() res: Response) {
      const PassportsizephotoUrl = await this.s3service.Addimage(file.PassportsizephotoUrl[0])
      const passportphotoUrl = await this.s3service.Addimage(file.passportphotoUrl[0])
      const userprofile = new Userprofile();
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
      userprofile.NID = req.body.NID
      userprofile.PassportExpireDate = req.body.PassportExpireDate
      userprofile.PassportNumber = req.body.PassportNumber
      userprofile.FaceBookId = req.body.FaceBookId
      userprofile.LinkedIn = req.body.LinkedIn
      userprofile.WhatsApp = req.body.whatsApp
      await this.profileRepository.save({ ...userprofile })
      return res.status(HttpStatus.CREATED).json({ staus: "success", message: 'user Profile Added successfully' });
   }


   // all user

   @Get('AllProfile')
   async FindAll(
      @Req() req: Request,
      @Res() res: Response) {
      const Profile = await this.UserProfileServices.FindAllProfile();
      return res.status(HttpStatus.OK).json({ Profile });
   }

   // // get user dashbboard
   @Get(':id')
   async UserDashboard(
      @Param('id') id: string,
      @Req() req: Request,
      @Res() res: Response) {
      const dashboard = await this.UserProfileServices.FindProfile(id);
      return res.status(HttpStatus.OK).json({ dashboard });
   }

   @Patch(':id')
   async updateTraveller(
      @Param('id') id: string,
      @Req() req: Request,
      @Res() res: Response,
      @Body() Userprofileupdatedto: updateUserProfileDto) {
      await this.UserProfileServices.UpdateProfile(id, Userprofileupdatedto)
      return res.status(HttpStatus.OK).json({ message: 'traveller updated successfully' });
   }

   @Delete(':id')
   async DeleteTraveller(
      @Param('id') id: string,
      @Req() req: Request,
      @Res() res: Response) {
      await this.UserProfileServices.DeleteProfile(id)
      return res.status(HttpStatus.OK).json({ message: 'traveller has deleted' });
   }

   @Post(':Uid/:Id')
   async addToWishlist(
      @Param('Uid', new ParseUUIDPipe) Uid: string,
      @Param('Id', ParseIntPipe) Id: number,
   ) {
      return this.UserProfileServices.addToWishlist(Uid, Id);
   }

   @Delete(':Uid/:Id')
   async removeFromWishlist(
      @Param('Uid', new ParseUUIDPipe) Uid: string,
      @Param('Id', ParseIntPipe) Id: number,
      @Res() res: Response,
   ) {
      await this.UserProfileServices.removeFromWishlist(Uid, Id);
      return res.status(HttpStatus.OK).json({
         status: "success",
         message: `Wishlist has removed`,
      });
   }

   @Get(':Uid')
   async getWishlist(@Param('Uid', new ParseUUIDPipe) Uid: string) {
      return this.UserProfileServices.getWishlist(Uid);
   }

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
      const Profile = await this.profileRepository.findOne({ where: { uuid } });
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
      Profile.Wallet += cheque.Amount
      await this.profileRepository.save(Profile);
      return res.status(HttpStatus.OK).send({ status: "success", message: " Cheque Deposit Request Successfull", })     
   }

   @Get('cheques/pending')
   async PendingChequeDeposit(): Promise<Cheque[]> {
   return await this.chequeRepository.find({});
   }


   @Post(':uuid/mobilebanking/deposit')
   @UseInterceptors(
     FileInterceptor('MobBankattachmenturl'),
   )
   async addmobilebankinbg( @UploadedFile()
   file: Express.Multer.File,
   @Param('uuid') uuid: string,
   @Req() req: Request,
   @Res() res: Response) {
      const Profile = await this.profileRepository.findOne({ where: { uuid } });
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
      Profile.Wallet += depositedAmount
      MobileBank.userprofile =Profile;
      await this.MobileBankingRepository.save(MobileBank)
      await this.profileRepository.save(Profile);
      return res.status(HttpStatus.OK).send({ status: "success", message: " Mobile Banking Deposit Request Successfull", })
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
      const Profile = await this.profileRepository.findOne({ where: { uuid } });
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
      await this.profileRepository.save(Profile)
      return res.status(HttpStatus.OK).send({ status: "success", message: " Banktransfer Deposit Request Successfull", })
}


}