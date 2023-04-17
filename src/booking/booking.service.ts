
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Repository } from 'typeorm';
import { Booking } from './entity/booking.entity';
import { CreateBookingDto } from './dto/booking.dto';
import * as nodemailer from 'nodemailer';
import * as PDFDocument from 'pdfkit';
import { User } from 'src/userProfile/entitties/user-login.entity';





@Injectable()
export class BookingService {
   constructor(@InjectRepository(Tourpackage)
   private tourPackageRepository: Repository<Tourpackage>,
      @InjectRepository(Traveller)
      private travelerRepository: Repository<Traveller>,
      @InjectRepository(Booking)
      private bookingRepository: Repository<Booking>,
      @InjectRepository(User)
      private userRepository: Repository<User>,
      

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
      const newbooking = await this.bookingRepository.create({
         tourPackage,
         travelers: arrayoftravlers,
         TotalPrice:TotalPrice
      })
      const savebooking= await this.bookingRepository.save(newbooking)
     const x= await this.sendBookingDetailsToUser(savebooking);
     console.log(x)
      return savebooking;
   
   }

   async sendBookingDetailsToUser(booking: Booking ) {
      const { Bookingid, tourPackage, travelers, TotalPrice } = booking;
      // Get tour package details
      const { MainTitle, TripType, Price } = tourPackage as Tourpackage;
  
      // Create a transporter with SMTP configuration
      const transporter = nodemailer.createTransport({
        host: 'mail.flyfarint.net', // Replace with your email service provider's SMTP host
        port: 465, // Replace with your email service provider's SMTP port
        secure: true, // Use TLS for secure connection
        auth: {
          user: 'booking@mailcenter.flyfarladies.com', // Replace with your email address
          pass: '123Next2$', // Replace with your email password
        },
      });

      const pdfDoc = new PDFDocument({font: 'Courier'});
      // Add a 50 point margin on all sides
      
// Set default font
pdfDoc.font('Helvetica');

// Add a bulleted list
   
   // Add different margins on each side
      // Add content to the PDF document, e.g., text, images, etc.
      pdfDoc.text(`Booking ID: ${Bookingid}`);
      pdfDoc.text(`Tour Package: ${MainTitle}`);
      pdfDoc.text(`Trip Type: ${TripType}`);
      pdfDoc.text(`Total Price: ${TotalPrice}`);
      pdfDoc.text('Travelers:');
  for (const traveler of travelers) {
   pdfDoc.text(`- ${traveler.FirstName} ${traveler.LastName}`);
  }
      // ...
    
      // Finalize the PDF document
      pdfDoc.end();
    
      // Convert the PDF document to a buffer
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);
      });
    
  
      // Compose the email message
      const mailOptions = {
        from: 'booking@mailcenter.flyfarladies.com', // Replace with your email address
        to: 'afridi@flyfarint.com', // Recipient's email address
        subject: 'Booking Details',
        text: 'Please find the attached PDF file.',
        attachments: [
         {
           filename: 'booking_details.pdf',
           content: pdfBuffer,
           contentType: 'application/pdf',
         },
       ],
      }
      await transporter.sendMail(mailOptions,(error, info) => {
         if (error) {
           console.error(error);
         } else {
           console.log('Email sent successfully:', info.response);
         }
       });
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
