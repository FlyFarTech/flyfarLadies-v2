
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Repository } from 'typeorm';
import { Booking } from './entity/booking.entity';
import { CreateBookingDto } from './dto/booking.dto';
import * as nodemailer from 'nodemailer';
import { User } from 'src/Auth/entities/user.entity';


@Injectable()
export class BookingService {
   constructor(@InjectRepository(Tourpackage)
   private tourPackageRepository: Repository<Tourpackage>,
      @InjectRepository(Traveller)
      private travelerRepository: Repository<Traveller>,
      @InjectRepository(Booking)
      private bookingRepository: Repository<Booking>,
      

   ) {}


   async BookTravelpackage(Id:number,bookingDto: CreateBookingDto, Email:User) {
      const {travelers,} =bookingDto
      const tourPackage = await this.tourPackageRepository.findOne({ where: { Id } })
      if (!tourPackage) {
         throw new HttpException(
            `TourPackage not found with this id=${Id}`,
            HttpStatus.BAD_REQUEST,
         );
      }

      const arrayoftravlers =[]
      let TotalPrice:number = 0
      for(const traveler of travelers){
      const { FirstName, LastName, DOB,PassportExpireDate,PassportNumber,Nationality, Price} = traveler;
        const newTraveler = new Traveller();
        newTraveler.FirstName = FirstName;
        newTraveler.LastName = LastName;
        newTraveler.Nationality =Nationality
        newTraveler.DOB =DOB
        newTraveler.PassportNumber =PassportNumber
        newTraveler.PassportExpireDate =PassportExpireDate
        newTraveler.Price = Price ? Price : tourPackage.Price;
        await this.travelerRepository.save(newTraveler)
        arrayoftravlers.push(newTraveler)
        TotalPrice +=newTraveler.Price
        
       
   }
      const newbooking = await this.bookingRepository.create({
         tourPackage,
         travelers: arrayoftravlers,
         TotalPrice:TotalPrice
      })
      const savebooking= await this.bookingRepository.save(newbooking)
      await this.sendBookingDetailsToUser(savebooking, Email);
      return savebooking;
   
   }

   async sendBookingDetailsToUser(booking: Booking,Email: User ) {
      const { Bookingid, tourPackage, travelers, TotalPrice } = booking;
  
      // Get tour package details
      const { MainTitle, TripType, Price } = tourPackage as Tourpackage;
  
      // Create a transporter with SMTP configuration
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Replace with your email service provider's SMTP host
        port: 465, // Replace with your email service provider's SMTP port
        secure: true, // Use TLS for secure connection
        auth: {
          user: 'booking@mailcenter.flyfarladies.com', // Replace with your email address
          pass: '123Next2$', // Replace with your email password
        },
      });
  
      // Compose the email message
      const mailOptions = {
        from: 'booking@mailcenter.flyfarladies.com', // Replace with your email address
        to: Email, // Recipient's email address
        subject: 'Booking Details',
        Text:'Booking Confirmation'
      }
      // await transporter.sendMail(mailOptions);
   }
   async getBooking(Bookingid:string):Promise<Booking[]>{
      const bookedpackage = await this.bookingRepository.find({ where: { Bookingid }, relations:['tourPackage','travelers']})
      return bookedpackage;
   }

   async FindAll():Promise<Booking[]>{
     const bookings= await this.bookingRepository.find({relations:[ 'tourPackage',
      'travelers']})
     return bookings;
   }

}
