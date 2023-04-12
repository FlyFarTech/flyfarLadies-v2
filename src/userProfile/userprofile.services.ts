
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { updateUserProfileDto } from './Dto/update-userprofile.dto';
import { Userprofile } from './entitties/userprofile.entities';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';


@Injectable()
export class UserProfileServices {
   constructor(
      @InjectRepository(Userprofile) private userRepository: Repository<Userprofile>,
      @InjectRepository(Tourpackage)
      private readonly tourPackageRepository: Repository<Tourpackage>,) { }

   async addToWishlist(Uid: string, Id: number): Promise<Userprofile> {
      const user = await this.userRepository.findOne({
         where: { Uid }, relations: {
            wishlist: true
         }
      });
      const tourPackage = await this.tourPackageRepository.findOne({ where: { Id } });
      if (!user || !tourPackage) {
         // Handle error, user or tourpackage not found
         throw new HttpException('User or Tourpackage not Found',HttpStatus.BAD_REQUEST);
      }
      user.wishlist.push(tourPackage);
     return await this.userRepository.save(user);
   }

   async removeFromWishlist(Uid: string, Id: number): Promise<Userprofile> {
      const user = await this.userRepository.findOne({ where: { Uid }, relations: { wishlist: true } });
      if (!user) {
         // Handle error, user or tourpackage not found
         throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      user.wishlist = user.wishlist.filter((tourPackage) => tourPackage.Id !== Id);
      return this.userRepository.save(user);
   }

   async getWishlist(Uid: string): Promise<Userprofile> {
      return await this.userRepository.findOne({ where: { Uid } });
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
   async FindProfile(Uid: string): Promise<Userprofile> {
      const Profile = await this.userRepository.findOne({ where: { Uid } });
      if (!Profile) {
         throw new HttpException("Profile not found", HttpStatus.BAD_REQUEST);
      }
      return Profile;
   }

   // update user
   async UpdateProfile(Uid: string, updtetProfilrDto: updateUserProfileDto) {
      const updtetProfileDto = await this.userRepository.update({ Uid }, { ...updtetProfilrDto })
      return updtetProfileDto;
   }

   // Delte User
   async DeleteProfile(Id: string) {
      const Profile = await this.userRepository.delete(Id)
      return Profile;
   }
}