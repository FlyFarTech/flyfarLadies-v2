
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Repository } from 'typeorm';
import { Booking } from './entity/booking.entity';
import { CreateBookingDto } from './dto/booking.dto';


@Injectable()
export class BookingService {
   constructor(@InjectRepository(Tourpackage)
   private tourPackageRepository: Repository<Tourpackage>,
      @InjectRepository(Traveller)
      private travelerRepository: Repository<Traveller>,
      @InjectRepository(Booking)
      private bookingRepository: Repository<Booking>,
      

   ) {}


   async BookTravelpackage(Id:number,bookingDto: CreateBookingDto) {
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
      const booking = await this.bookingRepository.create({
         tourPackage,
         travelers: arrayoftravlers,
         TotalPrice:TotalPrice
      })
      await this.bookingRepository.save(booking)
      return booking;
   
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
