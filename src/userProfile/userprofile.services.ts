import { WishlistItem } from 'src/userProfile/entitties/wishlist.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { User } from './entitties/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './Dto/user.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { Cheque } from './entitties/cheq.entity';
import { Cash } from './entitties/cash.entity';
import { BankTransfer } from './entitties/BankTransfer.entity';
import { CardPayment } from './entitties/Cardpayment.entity';
import { Bkash } from './entitties/Bkash.entity';
import { MobileBanking } from './entitties/MobileBanking.enity';


@Injectable()
export class UserServices {
   constructor(
      @InjectRepository(User) private userRepository: Repository<User>,
      @InjectRepository(Tourpackage)
      private readonly tourPackageRepository: Repository<Tourpackage>,
      @InjectRepository(User) private userRepo:Repository<User>,
      @InjectRepository(Cheque) private chequeRepository:Repository<Cheque>,
      @InjectRepository(Cash) private CashRepository:Repository<Cash>,
      @InjectRepository(BankTransfer) private BankTransferRepository:Repository<BankTransfer>,
      @InjectRepository(CardPayment) private CardPaymentRepository:Repository<CardPayment>,
      @InjectRepository(Bkash) private BkashPaymentRepository:Repository<Bkash>,
      @InjectRepository(MobileBanking) private MobileBankingRepository:Repository<MobileBanking>,
      private readonly jwtService:JwtService) {}

   // Register user
   async Register(userDto:CreateUserDto){
      const hashedPassword= await bcrypt.hash(userDto.Password, 10)
      const newuser= await this.userRepo.create({...userDto, Password: hashedPassword});
      await this.userRepo.save(newuser);
      await this.sendRegisterSuccecess(userDto)
      return this.generateToken(newuser)
   }
    
   // generate token 
   async generateToken(userdto: CreateUserDto): Promise<string> {
      const payload = { email: userdto.Email };
      const token = await this.jwtService.signAsync(payload);
      userdto.jwtToken = token;
      await this.userRepo.save(userdto);
      return token;
    }

    async sendRegisterSuccecess(userdto: CreateUserDto) {
      // Create a transporter with SMTP configuration
      const transporter = nodemailer.createTransport({
        host: 'mail.flyfarint.net', // Replace with your email service provider's SMTP host
        port: 465, // Replace with your email service provider's SMTP port
        secure: true, // Use TLS for secure connection
        auth: {
          user: 'registration@mailcenter.flyfarladies.com', // Replace with your email address
          pass: '123Next2$', // Replace with your email password
        },
      });
    
  
      // Compose the email message
      const mailOptions = {
        from: 'registration@mailcenter.flyfarladies.com', // Replace with your email address
        to:userdto.Email, // Recipient's email address
        subject: 'Welcome To Fly Far Ladies',
      }
      await transporter.sendMail(mailOptions,(error, info) => {
         if (error) {
           console.error(error);
         } else {
           console.log('Email sent successfully:', info.response);
         }
       });
   }


   // login user
   async login(Email: string, Password:string): Promise<string> {
   const user = await this.userRepo.findOne({ where:{Email} });
   if (!user) {
      throw new HttpException("User does not exists", HttpStatus.BAD_REQUEST,);
   }
   const isMatch = await bcrypt.compare(Password, user.Password);
   if (!isMatch) {
   throw new HttpException("password is not correct", HttpStatus.BAD_REQUEST,);
   }
   return this.generateToken(user);
   
}

   // verified token
   async verifyToken(jwtToken?: string): Promise<User> {
      if (!jwtToken) {
         throw new HttpException('JWT token is required', HttpStatus.BAD_REQUEST);
       }
      const user = await this.userRepo.findOne({ where:{jwtToken} ,relations:['chequeDeposit','wishlist','mobilebankDeposit','bankDeposit']});
      if (!user) {
         throw new HttpException("Invalid jwt token", HttpStatus.BAD_REQUEST);
      }
      return user;
   }


      // validate email
      async getUserByEmail(Email: string): Promise<User> {
         return this.userRepo.findOne({ where:{Email} });
       }

   async addToWishlist(uuid: string, Id: string): Promise<User> {
      const user = await this.userRepository.findOne({
         where: { uuid }  
      });

      const tourpackage =await this.tourPackageRepository.find({where:{Id}})
      
      if (!user) {
         // Handle error, user or tourpackage not found
         throw new HttpException('User or Tourpackage not Found',HttpStatus.BAD_REQUEST);
      }
      if (!user.wishlist) {
        user.wishlist = []; // Initialize wishlist array if it's undefined
      }
      const newWishlistItem = new WishlistItem();
      // newWishlistItem.tourPackage =tourpackage
      user.wishlist.push(newWishlistItem);
      return await this.userRepository.save(user);
    ;
   }

   async removeFromWishlist(uuid: string, id: string): Promise<User> {
      const user = await this.userRepository.findOne({ where: { uuid }, relations: { wishlist: true } });
      if (!user) {
         // Handle error, user or tourpackage not found
         throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      // user.wishlist = user.wishlist.filter((WishlistItem) => WishlistItem.tourPackage.id !== id);
      return this.userRepository.save(user);
   }

   async getWishlist(uuid: string): Promise<User> {
      return await this.userRepository.findOne({ where: { uuid } });
   }

   // get All User
   async FindAllProfile() {
      const Profile = await this.userRepository.find({});
      if (!Profile) {
         throw new HttpException("user Profile not found", HttpStatus.BAD_REQUEST);
      }
      return Profile;
   }

   // find user by Id
   async FindProfile(uuid: string): Promise<User> {
      const Profile = await this.userRepository.findOne({ where: { uuid }, relations:['chequeDeposit','wishlist','mobilebankDeposit','bankDeposit'] });
      if (!Profile) {
         throw new HttpException("Profile not found", HttpStatus.BAD_REQUEST);
      }
      return Profile;
   }


   // update user
   // Delete User
   async DeleteProfile(Id: string) {
      const Profile = await this.userRepository.delete(Id)
      return Profile;
   }

   
  async GetCheqDepo(uuid: string, Depositid: string) {
   const user = await this.userRepository.findOne({
     where: {
      uuid
     }
   })
   if (!user) {
     throw new HttpException(
       `User not found with this id=${uuid}`,
       HttpStatus.BAD_REQUEST,
     );
   }
   const cheque = await this.chequeRepository.findOne({ where: { Depositid } })
   if (!cheque) {
     throw new HttpException(
       `cheque deposit request does not exist with this id=${Depositid}`,
       HttpStatus.BAD_REQUEST,
     );
   }
   return cheque;
 }

 async AllDeposit(uuid: string) {
   const user = await this.userRepository.findOne({
     where: {
       uuid,
     },
   });
   if (!user) {
     throw new HttpException(
       `User not found with this id=${uuid}`,
       HttpStatus.BAD_REQUEST,
     );
   }
 
   const chequeDeposits = await this.chequeRepository.find({
     where: {
       DepositType: 'Cheque', // retrieve cheque deposit requests
     },
     order: {
       CreatedAt: 'DESC',
     },
   });
 
   const mobileBankings = await this.MobileBankingRepository.find({
     where: {
       DepositType: 'MobileBank', // retrieve mobile banking deposit requests
     },
     order: {
      CreatedAt: 'DESC',
     },
   });
 
   const bankTransfers = await this.BankTransferRepository.find({
     where: {

       DepositType: 'Bank', // retrieve bank transfer deposit requests
     },
     order: {
       CreatedAt: 'DESC',
     },
   });
 
   const allDeposits = [
     ...chequeDeposits,
     ...mobileBankings,
     ...bankTransfers,
   ].sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
 
   if (!allDeposits || allDeposits.length === 0) {
     throw new HttpException(
       `No deposit requests found`,
       HttpStatus.BAD_REQUEST,
     );
   }
 
   return allDeposits;
 }


 async AllDepositRequest() {
  const chequeDeposits = await this.chequeRepository.find({
    where: {
      DepositType: 'Cheque', // retrieve cheque deposit requests
    },
    order: {
      CreatedAt: 'DESC',
    },
  });

  const mobileBankings = await this.MobileBankingRepository.find({
    where: {
      DepositType: 'MobileBank', // retrieve mobile banking deposit requests
    },
    order: {
     CreatedAt: 'DESC',
    },
  });

  const bankTransfers = await this.BankTransferRepository.find({
    where: {

      DepositType: 'Bank', // retrieve bank transfer deposit requests
    },
    order: {
      CreatedAt: 'DESC',
    },
  });

  const allDeposits = [
    ...chequeDeposits,
    ...mobileBankings,
    ...bankTransfers,
  ].sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());

  if (!allDeposits || allDeposits.length === 0) {
    throw new HttpException(
      `No deposit requests found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  return allDeposits;
}
 

 async AllCheqDepo(uuid: string) {
   const user = await this.userRepository.findOne({
     where: {
      uuid
     }
   })
   if (!user) {
     throw new HttpException(
       `User not found with this id=${uuid}`,
       HttpStatus.BAD_REQUEST,
     );
   }
   const cheque = await this.chequeRepository.find({
      order:{
         CreatedAt:'DESC'
      }
   })
   if (!cheque) {
     throw new HttpException(
       `cheque deposit request does not exist`,
       HttpStatus.BAD_REQUEST,
     );
   }
   return cheque;
 }

 




}