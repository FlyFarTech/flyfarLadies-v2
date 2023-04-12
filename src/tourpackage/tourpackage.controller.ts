
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseFilePipeBuilder, HttpStatus, ParseIntPipe, Req, Res, ParseFilePipe, FileTypeValidator, HttpException, Logger, UploadedFile, Query, Put } from '@nestjs/common';
import { TourpackageService } from './tourpackage.service';
import { UpdateTourpackageDto } from './dto/update-tourpackage.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Tourpackage } from './entities/tourpackage.entity';
import { Repository } from 'typeorm';
import { AlbumImage } from './entities/albumimage.entity';
import { VisitedPlace } from './entities/visitedplace.entity';
import { CreateBookingPolicyDto } from './dto/creat-bookingpolicy.dto';
import { updateBookingPolicyDto } from './dto/update-bookingpolicy.dto';
import { createRefundPolicyDto } from './dto/create-refundpolicy.dto';
import { UpdateRefundPolicy } from './dto/update-refundpolicy.dto';
import { createpackageincluionDto } from './dto/create-packageInclusion.dto';
import { updatepackageInclusionDto } from './dto/update-packageincluion.dto';
import { CreateTourPackagePlanDto } from './dto/create-packagetourplan.dto';
import { updateTourPackagePlanDto } from './dto/update-tourpackageplan.dto';
import { CreatepackageExclsuionsDto } from './dto/create-packageexclusions.dto';
import { updatepackageExclusionsDto } from './dto/update-packageexclsuions.dto';
import { CreatePackageHighlightDto } from './dto/create-packagehighlights.dto';
import { UpdatepackageHighlightDto } from './dto/update-packagehighlightdto';
import { MainImage } from './entities/mainimage.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import { S3Service } from 'src/s3/s3.service';
import { updateinstallmentdto } from './dto/update-installmentDto';

@Controller('tourpackage')
export class TourpackageController {
  constructor(
    @InjectRepository(Tourpackage) private TourpackageRepo: Repository<Tourpackage>,
    @InjectRepository(MainImage) private MainImageRepo: Repository<MainImage>,
    @InjectRepository(AlbumImage) private AlbumimageRepo: Repository<AlbumImage>,
    @InjectRepository(VisitedPlace) private visitedplaceRepo: Repository<VisitedPlace>,
    private readonly tourpackageService: TourpackageService,
    // private s3service: S3Service

  ) {
  }

  @Post('Addpackage')
  @UseInterceptors(
    FileInterceptor('coverimageurl'),
  )

  async AddTravelPAckage(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req: Request,
    @Body() body,
    @Res() res: Response) {
    // const coverimageurl = await this.s3service.Addimage(file)
    const tourpackage = new Tourpackage();
    // tourpackage.coverimageurl = coverimageurl
    tourpackage.MainTitle = req.body.MainTitle
    tourpackage.SubTitle = req.body.SubTitle
    tourpackage.Price = req.body.Price
    tourpackage.City = req.body.City
    tourpackage.Discount =req.body.Discount
    tourpackage.Location = req.body.Location
    tourpackage.Availability = req.body.Availability
    tourpackage.StartDate = req.body.StartDate
    tourpackage.EndDate = req.body.EndDate
    tourpackage.TripType = req.body.TripType
    tourpackage.TotalDuration = req.body.TotalDuration
    tourpackage.PackageOverview = req.body.PackageOverview
    tourpackage.Showpackage = req.body.Showpackage
    tourpackage.Flight = req.body.Flight
    tourpackage.Transport = req.body.Transport
    tourpackage.Food = req.body.Food
    tourpackage.Hotel = req.body.Hotel
    tourpackage.Code = req.body.Code
    await this.TourpackageRepo.save(tourpackage)
    return res.status(HttpStatus.OK).send({ status: "success", message: "Travel package added succesfully", })
  }

  
  @Get('AllPackage')
  async FindAll(   
  @Req() req: Request,
  @Res() res: Response) {
  const Alltourpackage = await this.tourpackageService.FindAllPackages();
  return res.status(HttpStatus.OK).json({ Alltourpackage});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  const gettourpackage =  this.tourpackageService.findOne(+id);
    if (!gettourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return gettourpackage
  }

  @Get('/location/:TripType')
  findOneBytriptype(@Param('TripType') TripType: string): Promise<{name:string}[]> {
    return this.tourpackageService.getCityByTripType(TripType);
  }

  @Get('/')
  async getTourPackages(
    @Query('TripType') TripType: string,
    @Query('City') City: string,
    @Query('StartDate') StartDate: string,
  ): Promise<Tourpackage[]>{
    return this.tourpackageService.GetTourpackageByDiffirentfield(TripType, City, StartDate);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,
    @Body() updateTourpackageDto: UpdateTourpackageDto) {
    const updatepackage = await this.tourpackageService.updatePackage(
      +id,
      updateTourpackageDto,
    );
    if (!updatepackage) {
      throw new HttpException(
        `TourPackage not found with this = ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `Tour Package  has updated successfully`,

    });
  }

  @Patch('updateimage/:Id')
  @UseInterceptors( FileInterceptor('coverimageurl'))
  async updateImageUrl(
    @UploadedFile()
    file:Express.Multer.File,
    @Param('Id') Id: number,
    @Body() bodyParser,
    @Req() req: Request,
    @Res() res: Response,
  
  ) {
  // const imageurl = await this.s3service.updateImage(Id,file)
  const  tourpackage = new Tourpackage()
  // tourpackage.coverimageurl = imageurl
  // this is necessary when only one object is passed
  // await this.TourpackageRepo.update(Id,tourpackage)
  //for multiple object but both will work
  await this.TourpackageRepo.update({Id},{...tourpackage})
  return res.status(HttpStatus.OK).json({ 
      status: "success",
      message: `Cover image  has updated successfully`,

    });
  }

  @Post(':Id/addinstallment')
  async createInstallment(
    @Param('Id') Id: number,
    @Res() res: Response,
    @Body() installmentDto:CreateInstallmentDto[]
  ) {
    await this.tourpackageService.AddInstallment(Id, installmentDto);
    return res.status(HttpStatus.OK).send({ status: "success", message: "Travel package installment added succesfully", })
  }


  @Get(':id/getinstallment/:InstallmentId')
  async GetInstallment(
    @Param('id') id: number,
    @Param('InstallmentId') InstallmentId: number,
    @Req() req: Request,
    @Res() res: Response) {
    const installment = await this.tourpackageService.FindInstallment(id, InstallmentId)
    return res.status(HttpStatus.OK).json({
      status: "success", installment
    });
  }


    // update booking policy  
    @Patch(':id/updateinstallment/:InstallmentId')
    async updateInstallment(
      @Param('id') id: number,
      @Param('InstallmentId') InstallmentId: number,
      @Body() updateinstall: updateinstallmentdto,
      @Req() req: Request,
      @Res() res: Response,
    ) {
      await this.tourpackageService.updateInstallment(id, InstallmentId, updateinstall)
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: `installment updated successfully`,
      });
    }
  

    @Delete(':id/Installment/:InstallmentId')
  async DeleteInstallment(
    @Param('id') id: number,
    @Param('InstallmentId') InstallmentId: number,
    @Req() req: Request,
    @Res() res: Response) {
    await this.tourpackageService.DeleteInstallment(id, InstallmentId)
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `Installment has deleted successfully`,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response) {
    await this.tourpackageService.remove(+id);
    return res.status(HttpStatus.OK).send({ status: "success", message: "Travel package deleted succesfully" })
  }



  //add main image
  @Post(':Id/AddmainImage')
  @UseInterceptors(
    FilesInterceptor('MainImageUrl', 20)
  )
  async AddmainImages(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 6,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
    @Param('Id', ParseIntPipe) Id: number,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,
  ) {
    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add main image",
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const file of files) {
      // const coverimageurl = await this.s3service.Addimage(file)
      const mainimage = new MainImage();
      // mainimage.MainImageUrl = coverimageurl
      mainimage.MainImageTitle = req.body.MainImageTitle
      await this.MainImageRepo.save({ ...mainimage, tourpackage })
    }
    return res.status(HttpStatus.OK).send({
      status: "success",
      message: "main Image Added Successfully"
    })
  }


  // add booking policy
  @Post(':id/AddBookingPolicy')
  addTourPackageBookingPolicy(
    @Param('id', ParseIntPipe) id: number,
    @Body() bookingpolicydto: CreateBookingPolicyDto[],
    @Req() req: Request,
    @Res() res: Response,
  ) {

    this.tourpackageService.createbookingPolicy(
      id,
      bookingpolicydto,
    );
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: 'booking policy added',
    });
  }

  @Get(':id/getpolicy/:BkId')
  async getsingleBookingPolicy(
    @Param('id') id: number,
    @Param('BkId') BkId: number,
    @Req() req: Request,
    @Res() res: Response) {
    const bookingpolicy = await this.tourpackageService.FindbookingPolicy(id, BkId)
    return res.status(HttpStatus.OK).json({
      status: "success", bookingpolicy
    });
  }



  // update booking policy  
  @Patch(':id/updatepolicy/:BkId')
  async updateBookingPolicy(
    @Param('id') id: number,
    @Param('BkId') BkId: number,
    @Body() updatebookingpolicyDto: updateBookingPolicyDto,
    req: Request,
    @Res() res: Response,
  ) {
    const updatebooking = await this.tourpackageService.updateBookingolicy(id, BkId, updatebookingpolicyDto)
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `Booking policy updated successfully`,
    });
  }

  @Delete(':id/deletepolicy/:BkId')
  async DeleteBookingPolicy(
    @Param('id') id: number,
    @Param('BkId') BkId: number,
    @Req() req: Request,
    @Res() res: Response) {
    await this.tourpackageService.DeletebookingPolicy(id, BkId)
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `booking policy deleted successfully`,
    });
  }

  // booking policy end
  // refund policy start

  @Post(':id/AddrefundPolicy')
  async addrefundPolicy(
    @Param('id', ParseIntPipe) id: number,
    @Body() refundpolicydto: createRefundPolicyDto[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.tourpackageService.AddRefundPolicy(
      id,
      refundpolicydto,
    );
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: 'refund policy added',
    });
  }

  // get refund policy
  @Get(':id/getrefundpolicy/:RId')
  async getsinglerefundPolicy(
    @Param('id') id: number,
    @Param('RId') RId: number,
    @Req() req: Request,
    @Res() res: Response) {
    const refundpolicy = await this.tourpackageService.FindRefundPolicy(id, RId)
    return res.status(HttpStatus.OK).json({ refundpolicy });
  }

  // update refund policy  
  @Patch(':id/updateRefundpolicy/:RId')
  async updateRefundPolicy(
    @Param('id') id: number,
    @Param('RId') RId: number,
    @Body() updateRefundlicyDto: UpdateRefundPolicy,
    req: Request,
    @Res() res: Response,
  ) {
    const updaterefund = await this.tourpackageService.updateRefundolicy(id, RId, updateRefundlicyDto)
    return res.status(HttpStatus.OK).json({
      status: "success",
    });
  }


  // delete refund policy
  @Delete(':id/deleteRefundpolicy/:RId')
  async DeleteRefundPolicy(
    @Param('id') id: number,
    @Param('RId') RId: number,
    @Req() req: Request,
    @Res() res: Response) {
    await this.tourpackageService.DeleterefundPolicy(id, RId)
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `refund policy Id=${RId} has deleted successfully`,
    });
  }
  // refund policy End

  // Inclusions  start

  // add inclsuions
  @Post(':id/AddPackageInclusions')
  async addInclusion(
    @Param('id', ParseIntPipe) id: number,
    @Body() Inclusionsdto: createpackageincluionDto[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.tourpackageService.AddInclusions(
      id,
      Inclusionsdto,
    );
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: 'travel package Inlclusions Iteam Added',
    });
  }

  // get Singel Inclsuions

  @Get(':id/getinclsuions/:InId')
  async getsingleInclsuions(
    @Param('id') id: number,
    @Param('InId') InId: number,
    @Req() req: Request,
    @Res() res: Response) {
    const inclsuions = await this.tourpackageService.FindInclsuions(id, InId)
    return res.status(HttpStatus.OK).json({
      inclsuions
    });
  }


  // update refund policy  
  @Patch(':id/updateInclsuions/:InId')
  async updateInclsuions(
    @Param('id') id: number,
    @Param('InId') InId: number,
    @Body() updateInclusionsDto: updatepackageInclusionDto,
    req: Request,
    @Res() res: Response,
  ) {
    const updateInclsuions = await this.tourpackageService.updateInclusions(id, InId, updateInclusionsDto)
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `Inclsuions with Id=${InId} has updated successfully`,
      updateInclsuions,
    });
  }


  // delete Inclsuions
  @Delete(':id/deleteinclusions/:InId')
  async DeleteExcluions(
    @Param('id') id: number,
    @Param('InId') InId: number,
    @Req() req: Request,
    @Res() res: Response) {
    await this.tourpackageService.DeleteInclusion(id, InId)
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `Inclusion has deleted successfully`,
    });
  }

  //End refund policy


  @Get(':id/FindAlbum/:AlbumTitle')
  async getAllBumImage(
    @Param('id') id: number,
    @Param('AlbumTitle') AlbumTitle: string,
    @Req() req: Request,
    @Res() res: Response) {
    const Albumimages = await this.tourpackageService.FindAlbum(id, AlbumTitle)
    return res.status(HttpStatus.OK).json({
      Albumimages,
    });
  }

  @Patch(':Id/albumimage/:AlbumId')
  @UseInterceptors(FilesInterceptor('albumImageUrl',20))
  async updateAlbumImageUrl(
    @UploadedFiles()
    files:Express.Multer.File[],
    @Param('Id') Id: number,
    @Param('AlbumId') AlbumId:number,
    @Body() bodyParser,
    @Req() req: Request,
    @Res() res: Response,
  
  ) {
    for(const file of files){
      // const albumImageUrl = await this.s3service.updateAlbumImage(Id,AlbumId,file)
      const  albumImage = new AlbumImage()
      // albumImage.albumImageUrl = albumImageUrl
      // this is necessary when only one object is passed
      // await this.TourpackageRepo.update(Id,tourpackage)
      //for multiple object but both will work
      await this.AlbumimageRepo.update(AlbumId,albumImage)
    }

  return res.status(HttpStatus.OK).json({
      status: "success",
      message: `Album Image has updated successfully`,

    });
  }

  
  @Patch(':Id/mainimage/:mainimgId')
  @UseInterceptors(FilesInterceptor('MainImageUrl',20))
  async updateMainImageUrl(
    @UploadedFiles()
    files:Express.Multer.File[],
    @Param('Id') Id: number,
    @Param('mainimgId') mainimgId:number,
    @Body() bodyParser,
    @Req() req: Request,
    @Res() res: Response,
  
  ) {
    for(const file of files){
      // const mainImageUrl = await this.s3service.updateAlbumImage(Id,mainimgId,file)
      const  mainImage = new MainImage()
      // mainImage.MainImageUrl = mainImageUrl
      // this is necessary when only one object is passed
      // await this.TourpackageRepo.update(Id,tourpackage)
      //for multiple object but both will work
      await this.MainImageRepo.update(mainimgId,mainImage)
    }

  return res.status(HttpStatus.OK).json({
      status: "success",
      message: `mainImage has updated successfully`,

    });
  }


  
  @Patch(':Id/visitedimage/:VimageId')
  @UseInterceptors(FilesInterceptor('VisitedImagePath',20))
  async updateVistedImageUrl(
    @UploadedFiles()
    files:Express.Multer.File[],
    @Param('Id') Id: number,
    @Param('VimageId') VimageId:number,
    @Body() bodyParser,
    @Req() req: Request,
    @Res() res: Response,
  
  ) {
    for(const file of files){
      // const ImageUrl = await this.s3service.updatevisitedImage(Id,VimageId,file)
      const  visitedimage = new VisitedPlace()
      // visitedimage.VisitedImagePath = ImageUrl
      // this is necessary when only one object is passed
      // await this.TourpackageRepo.update(Id,tourpackage)
      //for multiple object but both will work
      await this.visitedplaceRepo.update(VimageId,visitedimage)
    }

  return res.status(HttpStatus.OK).json({
      status: "success",
      message: `visitedimage has updated successfully`,

    });
  }

  @Get(':id/allalbumimage')
  async getAllAlbumImage(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response) {
    const AllAlbumimages = await this.tourpackageService.FindAllAlbum(id)
    return res.status(HttpStatus.OK).json({
      AllAlbumimages,
    });
  }

  @Get(':id/Allmainimage')
  async getAllmainImage(
    @Param('id') id: number,

    @Req() req: Request,
    @Res() res: Response) {
    const AllMainImage = await this.tourpackageService.AllMainImage(id)
    return res.status(HttpStatus.OK).json({
      AllMainImage,
    });
  }

  @Post(':Id/AddalbumImage')
  @UseInterceptors(
    FilesInterceptor('albumImageUrl', 20,),
  )
  async AddalbumImages(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 6,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
    @Param('Id', ParseIntPipe) Id: number,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,
  ) {
    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add cover image",
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const file of files) {
      // const albumImageUrl = await this.s3service.Addimage(file)
      const newalbum = new AlbumImage();
      // newalbum.albumImageUrl = albumImageUrl
      newalbum.AlbumTitle = req.body.AlbumTitle
      await this.AlbumimageRepo.save({ ...newalbum, tourpackage })
    }
    return res.status(HttpStatus.OK).send({
      status: "success",
      message: "album Image Added Successfully"
    })
  }


  @Post(':Id/AddvistitedImages')
  @UseInterceptors(
    FilesInterceptor('VisitedImagePath', 20)
  )
  async AddvistitedImages(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 6,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
    @Param('Id', ParseIntPipe) Id: number,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,

  ) {
    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add cover image",
        HttpStatus.BAD_REQUEST,
      );
    }
    for (const file of files) {
      // const VisitedImagePath = await this.s3service.Addimage(file)
      const newalbum = new VisitedPlace();
      // newalbum.VisitedImagePath = VisitedImagePath
      newalbum.PlaceName = req.body.PlaceName
      await this.visitedplaceRepo.save({ ...newalbum, tourpackage })
    }
    return res.status(HttpStatus.OK).send({ status: "success", message: "visited Image Added Successfully", Tourpackage })
  }


  @Get(':id/visitedImage/getAllvisitedImage')
  async getAllvisitedImage(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response) {
    const visitedImage = await this.tourpackageService.FindAllvisitedImage(id)
    return res.status(HttpStatus.OK).json({
      visitedImage
    });
  }


  /// add tour package 

  @Post(':id/AddTourPackagePlan')
  addTourPackagePlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() tourpackagePlandto: CreateTourPackagePlanDto[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const tourpackageplan = this.tourpackageService.AddTourpackagePlan(
      id,
      tourpackagePlandto,
    );
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: 'travel package plan added Iteam Added',
    });
  }


  @Get(':id/tourplan/:dayId')
  async getdayplan(
    @Param('id') id: number,
    @Param('dayId') dayId: number,
    @Req() req: Request,
    @Res() res: Response) {
    const tourplan = await this.tourpackageService.Finddayplan(id, dayId)
    return res.status(HttpStatus.OK).json({ tourplan });
  }

  //update package exclsuions

  @Patch(':id/updateplan/:dayId')
  async updatePackageplan(
    @Param('id') id: number,
    @Param('dayId') dayId: number,
    @Body() updatedayplanDto: updateTourPackagePlanDto,
    req: Request,
    @Res() res: Response,
  ) {
    const updatedayplan = await this.tourpackageService.updatedayplan(id, dayId, updatedayplanDto)
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `dayplan with Id=${dayId} has updated successfully`,
      updatedayplan,
    });
  }


  // delete excluions
  @Delete(':id/deletedayplan/:dayId')
  async DeleteDay(
    @Param('id') id: number,
    @Param('dayId') dayId: number,
    @Req() req: Request,
    @Res() res: Response) {
    await this.tourpackageService.DeleteIdayplan(id, dayId)
    return res.status(HttpStatus.OK).json({
      message: `dayplan Id=${dayId} has deleted successfully`,
    });
  }



  /// addd package excluions
  @Post(':id/AddTourPackageExclusions')
  async addTourPackageExclusions(
    @Param('id', ParseIntPipe) id: number,
    @Body() packageexcluionsdto: CreatepackageExclsuionsDto[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const exclsuions = await this.tourpackageService.AddpackageExclsuions(
      id,
      packageexcluionsdto,
    );
    return res.status(HttpStatus.OK).send({
      status: "success", message: "exlusions  Added Successfully",
    })
  }

  // get package exclsuions

  @Get(':id/Exclsuions/:ExId')
  async getPackageExclsuions(
    @Param('id') id: number,
    @Param('ExId') ExId: number,
    @Req() req: Request,
    @Res() res: Response) {
    const exclsuions = await this.tourpackageService.FindExclsuions(id, ExId)
    return res.status(HttpStatus.OK).json({
      exclsuions
    });
  }

  //update package exclsuions



  @Patch(':id/updateExclsuions/:ExId')
  async updateExlsuions(
    @Param('id') id: number,
    @Param('ExId') ExId: number,
    @Body() updateExclusionsDto: updatepackageExclusionsDto,
    req: Request,
    @Res() res: Response,
  ) {
    const updateexlsuions = await this.tourpackageService.updateExclusions(id, ExId, updateExclusionsDto)
    return res.status(HttpStatus.OK).json({
      message: `Exclsuions with Id=${ExId} has updated successfully`,
      updateexlsuions,
    });
  }


  // delete excluions

  @Delete(':id/deleteExclusions/:ExId')
  async DeleteIncluions(
    @Param('id') id: number,
    @Param('ExId') ExId: number,
    @Req() req: Request,
    @Res() res: Response) {
    await this.tourpackageService.DeleteIExclusion(id, ExId)
    return res.status(HttpStatus.OK).json({
      message: `Exclusion Id=${ExId} has deleted successfully`,
    });
  }
  // end exclusions....................





  // start package highlight............

  // add tour package highlight
  @Post(':id/AddTourPackageHighlight')
  addTourPackageHighlight(
    @Param('id', ParseIntPipe) id: number,
    @Body() packageHighlightdto: CreatePackageHighlightDto[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const tourpackagehighlight = this.tourpackageService.AddPackageHighlight(
      id,
      packageHighlightdto,
    );
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: 'travel package Highlight added'
    });
  }




  @Get(':id/getHighlight/:HiId')
  async getPackageHighlight(
    @Param('id') id: number,
    @Param('HiId') HiId: number,
    @Req() req: Request,
    @Res() res: Response) {
    const Highlight = await this.tourpackageService.FindHighlight(id, HiId)
    return res.status(HttpStatus.OK).json({
      Highlight
    });
  }

  //update package Highlight



  @Patch(':id/updateHighlight/:HiId')
  async updateHiId(
    @Param('id') id: number,
    @Param('HiId') HiId: number,
    @Body() updatehighlightDto: UpdatepackageHighlightDto,
    req: Request,
    @Res() res: Response,
  ) {
    const updateHighlight = await this.tourpackageService.updateHighlight(id, HiId, updatehighlightDto)
    return res.status(HttpStatus.OK).json({
      status: "success",
      message: `Highlight with Id ${HiId} has updated successfully`
    });
  }

  // delete Highlight

  @Delete(':id/DeleteHighlight/:HiId')
  async DeleteHighlight(
    @Param('id') id: number,
    @Param('HiId') HiId: number,
    @Req() req: Request,
    @Res() res: Response) {
    await this.tourpackageService.DeleteHighlight(id, HiId)
    return res.status(HttpStatus.OK).json({
      message: `Highlight Id ${HiId} has deleted successfully`,
    });
  }


}