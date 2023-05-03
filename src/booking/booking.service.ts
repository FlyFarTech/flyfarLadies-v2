import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entity/booking.entity';
import { CreateBookingDto } from './dto/booking.dto';
import * as nodemailer from 'nodemailer';
import * as PDFDocument from 'pdfkit';
import { User } from 'src/userProfile/entitties/user.entity';

@Injectable()
export class BookingService {
   constructor(@InjectRepository(Tourpackage)
   private tourPackageRepository: Repository<Tourpackage>,
      @InjectRepository(Traveller)
      private travelerRepository: Repository<Traveller>,
      @InjectRepository(Booking)
      private bookingRepository: Repository<Booking>,
      @InjectRepository(User)
      private UserRepository: Repository<User>,
   ) {}


   async BookTravelpackage(Id:string,bookingDto: CreateBookingDto,Email:string ){
      const {travelers,} =bookingDto
      const tourPackage = await this.tourPackageRepository.findOne({ where: { Id } })
      if (!tourPackage) {
         throw new HttpException(
            `TourPackage not found with this id=${Id}`,
            HttpStatus.BAD_REQUEST,
         );
      }
      const userprofile = await this.UserRepository.findOne({ where: {Email}})
      const arrayoftravlers =[]
      let TotalPrice:number = 0
      for(const traveler of travelers){
      const { FirstName, LastName, DOB,PassportExpireDate,PassportNumber,Nationality, Price, Gender} = traveler;
        const newTraveler = new Traveller();
        newTraveler.FirstName = FirstName;
        newTraveler.LastName = LastName;
        newTraveler.Nationality =Nationality
        newTraveler.Gender =Gender
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
         TotalPrice:TotalPrice,
         Email:userprofile.Email,
         Name:userprofile.Name,
         Wallet:userprofile.Wallet,
         Mobile:userprofile.Mobile,
         WhatsApp:userprofile.WhatsApp,
         FaceBookId:userprofile.FaceBookId,
         LinkedIn:userprofile.LinkedIn

      })
      const savebooking= await this.bookingRepository.save(newbooking)
      await this.sendBookingDetailsToUser(savebooking,Email);
      return savebooking;
   
   }

   async sendBookingDetailsToUser(booking: Booking,Email:string ) {
      const { Bookingid, tourPackage, travelers, TotalPrice } = booking;
      // Get tour package details
      const { MainTitle, TripType} = tourPackage as Tourpackage;
      // Create a transporter with SMTP configuration
      const transporter = nodemailer.createTransport({
        host: 'mail.flyfarint.net', // Replace with your email service provider's SMTP host
        port: 465, // Replace with your email service provider's SMTP port
        secure: true, // Use TLS for secure connection
        auth: {
          user: 'flyfarladies@mailcenter.flyfarladies.com', // Replace with your email address
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
      pdfDoc.end();
    
      // Convert the PDF document to a buffer
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);
      });

      const useremail = await this.UserRepository.findOne({where:{Email}})
      // Compose the email message
      const mailOptions = {
        from: 'flyfarladies@mailcenter.flyfarladies.com', // Replace with your email address
        to: useremail.Email, // Recipient's email address
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
      const bookedpackage = await this.bookingRepository.find({ where: { Bookingid },relations:[ 'tourPackage',
      'travelers']})
      return bookedpackage;
   }

   async userAllBooking(uuid:string){
    const user = await this.UserRepository.findOne({where:{uuid}})
    if (!user) {
      throw new NotFoundException('User Not valid');
   }
    const bookedpackage = await this.bookingRepository.find({ where: {},relations:[ 'tourPackage']})
    return {bookedpackage};
 }

   async approveBooking(Bookingid: string, uuid:string,
    Email:string,): Promise<void> {
      // Find the booking object with the provided ID
      const booking = await this.bookingRepository.findOne({where:{Bookingid}});
      if(booking.status !== BookingStatus.PENDING)
      {
         throw new NotFoundException('Booking request already approved or Rejected');
      }
      // Update the booking status to approved
    
      const profile = await this.UserRepository.findOne({ where: {uuid} });
      if (!profile) {
         throw new NotFoundException('user not found');
      }
      const totalprice  = booking.TotalPrice
      if(profile.Wallet>=totalprice){
         profile.Wallet -= totalprice
         await this.UserRepository.save(profile);
         booking.status = BookingStatus.APPROVED;
         booking.Wallet =profile.Wallet
         booking.UpdatedAt = new Date()
         const updatedBooking = await this.bookingRepository.save(booking);
         await this.sendBookingApprovalToUser(updatedBooking, Email);
      }
      else{
         throw new BadRequestException('Insufficient balance! please deposit to your wallet');
      }
      
    }


    async sendBookingApprovalToUser(booking: Booking,Email:string) {
      const { Bookingid,TotalPrice } = booking;
      // Get tour package details
   
      // Create a transporter with SMTP configuration
      const transporter = nodemailer.createTransport({
        host: 'mail.flyfarint.net', // Replace with your email service provider's SMTP host
        port: 465, // Replace with your email service provider's SMTP port
        secure: true, // Use TLS for secure connection
        auth: {
          user: 'flyfarladies@mailcenter.flyfarladies.com', // Replace with your email address
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
      pdfDoc.text(`Total Price: ${TotalPrice}`);

      pdfDoc.end();
   
      // Convert the PDF document to a buffer
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);
      });
      const bookedemail = await this.bookingRepository.findOne({ where: {Email} });

      
  
      // Compose the email message
      const mailOptions = {
        from: 'flyfarladies@mailcenter.flyfarladies.com', // Replace with your email address
        to: bookedemail.Email, // Recipient's email address
        subject: 'Booking Confirmation',
        text: `congrates! your booking has been confrimed`,
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

   async FindAll(){
     const bookings= await this.bookingRepository.find({relations:[ 'tourPackage',
      'travelers']})
     return bookings;
   }

}
