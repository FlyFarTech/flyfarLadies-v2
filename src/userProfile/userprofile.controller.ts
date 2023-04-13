import { UserServices } from './../Auth/user.service';

import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, ParseUUIDPipe, Patch, Post, Req, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from 'express';
import { diskStorage } from "multer";
import { Repository } from "typeorm";
import { CreateUserProfileDto } from "./Dto/create-userprofile.dto";
import { updateUserProfileDto } from "./Dto/update-userprofile.dto";
import { Userprofile } from "./entitties/userprofile.entities";
import { UserProfileServices } from "./userprofile.services";
import { S3Service } from "src/s3/s3.service";



@Controller('userProfile')
export class userProfileController {
   constructor(@InjectRepository(Userprofile) private profileRepository: Repository<Userprofile>,
      private readonly UserProfileServices: UserProfileServices,
      private s3service: S3Service
      ) {}

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
   async TravellerDashboard(
      @Param('id') id: string,
      @Req() req: Request,
      @Res() res: Response) {
      const traveller = await this.UserProfileServices.FindProfile(id);
      return res.status(HttpStatus.OK).json({ traveller });
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

}