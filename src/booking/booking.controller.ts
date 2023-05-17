
import { Body, HttpStatus, Post, Req, Res, Patch, NotFoundException } from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Express } from 'express';
import { Request, Response } from 'express';
import { CreateBookingDto } from './dto/booking.dto';
import { User } from 'src/userProfile/entitties/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entity/booking.entity';
@Controller('booking')
export class BookingController {
  constructor(@InjectRepository(User)
  private UserRepository: Repository<User>,
  @InjectRepository(Booking)
  private bookingRepository: Repository<Booking>,

  private readonly bookingService: BookingService) { }

  @Post(':Id/addbooking')
  async addbooking(

    @Body() bookingDto: CreateBookingDto,
    @Param('FFLPKID') FFLPKID:string,
    uuid:string,
    @Req() req: Request,
    @Res() res: Response) { 
    await this.bookingService.BookTravelpackage(FFLPKID,bookingDto,uuid)
    return res.status(HttpStatus.OK).send({ status: "success", message: "Booking sucessfull"})
  }

   @Post(':bookingId/confirm-with-installment')
  async confirmBookingWithInstallment(
    @Param('Bookingid') Bookingid:string,
    uuid:string,
    @Req() req: Request,
    @Res() res: Response) { 
    await this.bookingService.confirmBookingWithInstallment(Bookingid,uuid)
    return res.status(HttpStatus.OK).send({ status: "success", message: "Payment Successfull sucessfull"})
  }


  @Patch(':Bookingid/confirmed')
  async Approvedbooking(
    @Param('Bookingid') Bookingid:string,
    @Body('uuid') uuid:string,
    Email:string,
    @Req() req: Request,
    @Res() res: Response) { 
    await this.bookingService.MakePayementwithwallet(Bookingid, uuid, Email)
    return res.status(HttpStatus.OK).send({ status: "success", message: "Booking Confirmed"})
  }

  @Get(':Bookingid')
  async getBooking(
    @Param('Bookingid') Bookingid: string) {
    return await this.bookingService.getBooking(Bookingid)
  }

  @Get(':uuid/alluserbookings')
  async getalluserBooking(
    @Param('uuid') uuid: string) {
    const user = await this.UserRepository.find({ where: { uuid } });
    if (!user) {
      throw new NotFoundException('User Not valid');
    }
    const bookedPackages = await this.bookingRepository.find({
      relations: [
        'tourPackage',
        'tourPackage.mainimage',
        'tourPackage.albumImages',
        'tourPackage.vistitedImages',
        'tourPackage.exclusions',
        'tourPackage.PackageInclusions',
        'tourPackage.BookingPolicys',
        'tourPackage.highlights',
        'tourPackage.refundpolicys',
        'tourPackage.tourpackageplans',
        'tourPackage.installments',
        'travelers'
      ]
  })
    return bookedPackages
  }

      @Get('getall/booking')
      async getALlBooking(@Res() res: Response) {
        const bookings = await this.bookingService.FindAll()
        return res.status(HttpStatus.OK).json({ bookings });
    
      }
  }



