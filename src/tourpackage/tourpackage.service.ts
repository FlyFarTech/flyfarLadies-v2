
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateBookingPolicyDto } from './dto/creat-bookingpolicy.dto';
import { CreatepackageExclsuionsDto } from './dto/create-packageexclusions.dto';
import { CreatePackageHighlightDto } from './dto/create-packagehighlights.dto';
import { createpackageincluionDto } from './dto/create-packageInclusion.dto';
import { CreateTourPackagePlanDto } from './dto/create-packagetourplan.dto';
import { createRefundPolicyDto } from './dto/create-refundpolicy.dto';
import { updateBookingPolicyDto } from './dto/update-bookingpolicy.dto';
import { updatepackageExclusionsDto } from './dto/update-packageexclsuions.dto';
import { UpdatepackageHighlightDto } from './dto/update-packagehighlightdto';
import { UpdateTourpackageIncludedDto } from './dto/update-packageInclude.dto';
import { updatepackageInclusionDto } from './dto/update-packageincluion.dto';
import { UpdateRefundPolicy } from './dto/update-refundpolicy.dto';
import { UpdateTourpackageDto } from './dto/update-tourpackage.dto';
import { updateTourPackagePlanDto } from './dto/update-tourpackageplan.dto';
import { AlbumImage } from './entities/albumimage.entity';
import { bookingpolicy } from './entities/bookingpolicy.entity';
import { MainImage } from './entities/mainimage.entity';
import { packageexcluions } from './entities/packageexclsuions.entity';
import { packagehighlight } from './entities/packagehighlight.entity';
import { Packageinclusion } from './entities/packageInclusion.entitry';
import { refundpolicy } from './entities/refundpolicy.entity';
import { Tourpackage } from './entities/tourpackage.entity';
import { tourpackageplan } from './entities/tourpackageplan.entity';
import { VisitedPlace } from './entities/visitedplace.entity';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { Installment } from './entities/installment.entity';
import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { updateinstallmentdto } from './dto/update-installmentDto';

// tour package ser
@Injectable()
export class TourpackageService {
constructor(
@InjectRepository(Tourpackage)
private TourpackageRepo:Repository<Tourpackage>,
@InjectRepository(Packageinclusion)
private packageInclusionRepo: Repository<Packageinclusion>,
@InjectRepository(tourpackageplan)
private tourpackagePlanRepo: Repository<tourpackageplan>,
@InjectRepository(packageexcluions)
private packageexcluionsRepo: Repository<packageexcluions>,
@InjectRepository(packagehighlight)
private packageHighlightRepo: Repository<packagehighlight>,
@InjectRepository(bookingpolicy)
private bookingPolicyRepo: Repository<bookingpolicy>,
@InjectRepository(refundpolicy)
private refundPolicyRepo: Repository<refundpolicy>,
@InjectRepository(Installment)
private InstallmentRepo: Repository<Installment>,
@InjectRepository(AlbumImage)
private AlbumImageRepo: Repository<AlbumImage>,
@InjectRepository(MainImage) private MainImageRepo: Repository<MainImage>,
@InjectRepository(VisitedPlace)
private visitedImageRepo: Repository<VisitedPlace>
){}

async  findOne(Id: number) {
    const gettourpackage =  this.TourpackageRepo.findOne({where:{Id}});
    return gettourpackage;
  }

  async FindAllPackages(){
    const packages= await this.TourpackageRepo.find()
    return packages;
   }

  async GetTourpackageByDiffirentfield(TripType:string, City:string,StartDate:string,Country:string):Promise<Tourpackage[]>{
    const [month, year] = StartDate.split(" ")
    const startOfMonth = new Date(`${month} 1, ${year}`);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    const queryBuilder = this.TourpackageRepo.createQueryBuilder('tourPackage');
    queryBuilder.leftJoinAndSelect('tourPackage.mainimage', 'mainimage')
    queryBuilder.leftJoinAndSelect('tourPackage.albumImages', 'albumImages')
    queryBuilder.leftJoinAndSelect('tourPackage.vistitedImages', 'vistitedImages')
    queryBuilder.leftJoinAndSelect('tourPackage.PackageInclusions', 'PackageInclusions')
    queryBuilder.leftJoinAndSelect('tourPackage.BookingPolicys', 'BookingPolicys')
    queryBuilder.leftJoinAndSelect('tourPackage.highlights', 'highlights')
    queryBuilder.leftJoinAndSelect('tourPackage.tourpackageplans', 'tourpackageplans')
    queryBuilder.leftJoinAndSelect('tourPackage.refundpolicys', 'refundpolicys')
    queryBuilder.leftJoinAndSelect('tourPackage.installments', 'installments')
    queryBuilder.leftJoinAndSelect('tourPackage.exclusions', 'exclusions')
    queryBuilder.where('tourPackage.TripType = :TripType', { TripType });
    queryBuilder.andWhere(new Brackets(qb => {
      qb.where('tourPackage.City = :City', { City })
        .orWhere('tourPackage.Country = :Country', { Country });
  }));
    queryBuilder.andWhere('tourPackage.StartDate >= :startOfMonth', { startOfMonth });
    queryBuilder.andWhere('tourPackage.StartDate <= :endOfMonth', { endOfMonth });
    const tourPackages = await queryBuilder.getMany();
    return tourPackages;
  
  }

  async getCityByTripType(TripType: string): Promise<{name:string}[]> {
    const city = await this.TourpackageRepo
      .createQueryBuilder('tourpackage')
      .select('DISTINCT tourpackage.City')
      .where('tourpackage.Triptype = :TripType',{ TripType })
      .getRawMany();

    return city.map((City) => ({name:City.City}));
  }

async  updatePackage(Id: number, updateTourpackageDto: UpdateTourpackageDto) {
    return await this.TourpackageRepo.update({Id}, {...updateTourpackageDto});
  }

async  remove(Id: number) {
  const tourpackage=  this.TourpackageRepo.findOne({where:{Id}});
  if (!tourpackage) {
    throw new HttpException(
      `TourPackage not found with this id=${Id}`,
      HttpStatus.BAD_REQUEST,
    );
  }
    return  this.TourpackageRepo.delete(Id);
  }

  // get all Album image
  async FindAlbum(Id: number, AlbumTitle:string) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const AlbumImage = await this.AlbumImageRepo.find({where:{AlbumTitle}})
    if (!AlbumImage) {
      throw new HttpException(
        `Image not found with `,
        HttpStatus.BAD_REQUEST,
      );
    }
    return AlbumImage;
  }

  async FindAllAlbum(Id: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const AllAlbumImage = await this.AlbumImageRepo.find({})
    if (!AllAlbumImage) {
      throw new HttpException(
        `Image not found with `,
        HttpStatus.BAD_REQUEST,
      );
    }
    return AllAlbumImage;
  }
  

  async AllMainImage(Id: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const MainImage = await this.MainImageRepo.find({})
    if (!MainImage) {
      throw new HttpException(
        `Image not found with `,
        HttpStatus.BAD_REQUEST,
      );
    }
    return MainImage;
  }


//visited image
  async FindAllvisitedImage(Id: number,) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const visitedImage = await this.visitedImageRepo.find({})
    if (!AlbumImage) {
      throw new HttpException(
        `Image not found with `,
        HttpStatus.BAD_REQUEST,
      );
    }
    return visitedImage;
  }



  // booking policy start.........................

  //add booking policy
  async createbookingPolicy(Id: number, CreateBookingPolicyDto:CreateBookingPolicyDto[]) {
    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add booking policy",
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdPolicies: bookingpolicy[] = [];
    for(const CreatebookingPolicydto of CreateBookingPolicyDto){
      const creatpolicy = await this.bookingPolicyRepo.create({ ...CreatebookingPolicydto, tourpackage });
      const createdpolicy = await this.bookingPolicyRepo.save(creatpolicy)
      createdPolicies.push(createdpolicy);
    }
    return createdPolicies;
   

  }

  async AddInstallment(Id: number, CreateInstallmentDto:CreateInstallmentDto[]){
    const tourpackage = await this.TourpackageRepo.findOneBy({Id})
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found",
        HttpStatus.BAD_REQUEST,
      );
    }
    const createinstallment: Installment[] =[];
    for(const createinstallmentdto of CreateInstallmentDto){
    const installment = await this.InstallmentRepo.create({...createinstallmentdto,tourpackage})
    const createdinstallment =await this.InstallmentRepo.save(installment)
    createinstallment.push(createdinstallment);
    }
    return createinstallment
  
  }

  async FindInstallment(Id: number, InstallmentId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const installment = await this.InstallmentRepo.findOne({ where: { InstallmentId } })
    if (!installment) {
      throw new HttpException(
        `installment not found with this id=${InstallmentId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return installment;
  }


  async updateInstallment(Id: number, InstallmentId: number, updateinstall: updateinstallmentdto) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bookingpolicy = await this.InstallmentRepo.findOne({ where: { InstallmentId } })
    if (!bookingpolicy) {
      throw new HttpException(
        `installment not found with this id=${InstallmentId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatepolicy = await this.InstallmentRepo.update({ InstallmentId }, { ...updateinstall })
    return updatepolicy;
  }


  async DeleteInstallment(Id: number, InstallmentId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bookingpolicy = await this.InstallmentRepo.findOne({ where: { InstallmentId } })
    if (!bookingpolicy) {
      throw new HttpException(
        `Installment not found with this id=${InstallmentId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.InstallmentRepo.delete(InstallmentId);
  }

  // find booking policy
  async FindbookingPolicy(Id: number, BkId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bookingpolicy = await this.bookingPolicyRepo.findOne({ where: { BkId } })
    if (!bookingpolicy) {
      throw new HttpException(
        `booking policy not found with this id=${BkId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return bookingpolicy;
  }

  //update booking policy
  async updateBookingolicy(Id: number, BkId: number, updateBOokingPolicy: updateBookingPolicyDto) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bookingpolicy = await this.bookingPolicyRepo.findOne({ where: { BkId } })
    if (!bookingpolicy) {
      throw new HttpException(
        `booking policy not found with this id=${BkId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatepolicy = await this.bookingPolicyRepo.update({ BkId }, { ...updateBOokingPolicy })
    return updatepolicy;
  }


  



  //Delete booking policy
  async DeletebookingPolicy(Id: number, BkId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bookingpolicy = await this.bookingPolicyRepo.findOne({ where: { BkId } })
    if (!bookingpolicy) {
      throw new HttpException(
        `booking policy not found with this id=${BkId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.bookingPolicyRepo.delete(BkId);
  }

  //End Booking Policy..........................



  // start refund policy
  async AddRefundPolicy(
    Id: number,
    RefundpolicyDto: createRefundPolicyDto[],
  ) {
    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add cover image",
        HttpStatus.BAD_REQUEST,
      );
    }
    const refundpolic:refundpolicy []=[]
    for(const refundpolicydto of RefundpolicyDto){
      const createrefundpolicy = this.refundPolicyRepo.create({...refundpolicydto,tourpackage });
      const createdrefundpolicy = await this.refundPolicyRepo.save(createrefundpolicy)
      refundpolic.push(createdrefundpolicy);
    }
    return refundpolic;

  }


  // get refund policy
  async FindRefundPolicy(Id: number, RId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const refundpolicy = await this.refundPolicyRepo.findOne({ where: { RId } })
    if (!refundpolicy) {
      throw new HttpException(
        `refund policy not found with this id=${RId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return refundpolicy;
  }


  // update Refund policy
  async updateRefundolicy(Id: number, RId: number, updaterefundPolicy: UpdateRefundPolicy) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bookingpolicy = await this.refundPolicyRepo.findOne({ where: { RId } })
    if (!bookingpolicy) {
      throw new HttpException(
        `Refund policy not found with this id=${RId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatepolicy = await this.refundPolicyRepo.update({ RId }, { ...updaterefundPolicy })
    return updatepolicy;
  }


  //Delete refund policy
  async DeleterefundPolicy(Id: number, RId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const Refundpolicy = await this.refundPolicyRepo.findOne({ where: { RId } })
    if (!Refundpolicy) {
      throw new HttpException(
        `Refund policy not found with this id=${RId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.refundPolicyRepo.delete(RId);
  }

//End refund Policy

// Add package inclusions


  async AddInclusions(
    Id: number,
    inclusionsDto: createpackageincluionDto[],
  ) {
    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add cover image",
        HttpStatus.BAD_REQUEST,
      );
    }
    const inclsuinsarray: Packageinclusion[]= []
    for(const inclusionsdto of inclusionsDto){
      const newInclusions = await this.packageInclusionRepo.create({...inclusionsdto, tourpackage });
      const saveinclusions = await this.packageInclusionRepo.save(newInclusions)
      inclsuinsarray.push(saveinclusions);
    }
    return inclsuinsarray;
  }

  // find inclusions
  async FindInclsuions(Id: number, InId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const inclusions = await this.packageInclusionRepo.findOne({ where: { InId } })
    if (!inclusions) {
      throw new HttpException(
        `Inclusions not found with this id=${InId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return inclusions;
  }



  // update inclusions
  async updateInclusions(Id: number, InId: number, updateInclusionsDto: updatepackageInclusionDto) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const inclsuions = await this.packageInclusionRepo.findOne({ where: { InId } })
    if (!inclsuions) {
      throw new HttpException(
        `inclusions not found with this id=${InId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updateinclusion = await this.packageInclusionRepo.update({ InId }, { ...updateInclusionsDto })
    return updateinclusion;
  }


  // Delete Inclusions
  async DeleteInclusion(Id: number, InId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const inclusions = await this.packageInclusionRepo.findOne({ where: { InId } })
    if (!inclusions) {
      throw new HttpException(
        `Inclsuions not found with this id=${InId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.packageInclusionRepo.delete(InId);
  }

  /// end inclusions....................

  /// start package exclsuions

  //add exclsuions

  async AddpackageExclsuions(
    Id: number,
    exclusionDto: CreatepackageExclsuionsDto[],
  ) {

    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add cover image",
        HttpStatus.BAD_REQUEST,
      );
    }

    const exclsuinsarray: packageexcluions[]= []
    for(const exclusiondto of exclusionDto){
      const newExclsuions = await this.packageexcluionsRepo.create({...exclusiondto, tourpackage });
      const saveexclsuions = await this.packageexcluionsRepo.save(newExclsuions)
      exclsuinsarray.push(saveexclsuions);
    }
    return exclsuinsarray;
  

  }

  // find Exclusions
  async FindExclsuions(Id: number, ExId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const Exclusions = await this.packageexcluionsRepo.findOne({ where: { ExId } })
    if (!Exclusions) {
      throw new HttpException(
        `Exclusions not found with this id=${ExId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return Exclusions;
  }

  // update inclusions
  async updateExclusions(Id: number, ExId: number, updateExlusionsDto: updatepackageExclusionsDto) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const exclsuions = await this.packageexcluionsRepo.findOne({ where: { ExId } })
    if (!exclsuions) {
      throw new HttpException(
        `exclsuions not found with this id=${ExId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updateExclsuions = await this.packageexcluionsRepo.update({ ExId }, { ...updateExlusionsDto })
    return updateExclsuions;
  }


  // Delete exclusions
  async DeleteIExclusion(Id: number, ExId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  const exclusions = await this.packageexcluionsRepo.findOne({ where: { ExId } })
    if (!exclusions) {
      throw new HttpException(
        `exclusions not found with this id=${ExId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.packageexcluionsRepo.delete(ExId);
  }

  // End exclusions


  //start  included


  async AddTourpackagePlan(
    Id: number,
    tourPackageplanDto: CreateTourPackagePlanDto[],
  ) {
    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add tourplan",
        HttpStatus.BAD_REQUEST,
      );
    }
    const createtourplan: tourpackageplan[]=[]
    for(const tourpackageplandto of tourPackageplanDto){
      const newTourplan = await this.tourpackagePlanRepo.create({...tourpackageplandto, tourpackage });
      const savetourplan = await this.tourpackagePlanRepo.save(newTourplan)
      createtourplan.push(savetourplan);
    }
    return createtourplan;

  }
  
  // find Exclusions
  async Finddayplan(Id: number, dayId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dayplan = await this.tourpackagePlanRepo.findOne({ where: { dayId } })
    if (!dayplan) {
      throw new HttpException(
        `tour plan not found not found with this id=${dayId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return dayplan;
  }

  // update inclusions
  async updatedayplan(Id: number, dayId: number, updatedayplanDto: updateTourPackagePlanDto) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const dayplan = await this.tourpackagePlanRepo.findOne({ where: { dayId } })
    if (!dayplan) {
      throw new HttpException(
        `day plan not found with this id=${dayId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const uodatedayplan = await this.tourpackagePlanRepo.update({ dayId }, { ...updatedayplanDto })
    return uodatedayplan;
  }


  // Delete exclusions
  async DeleteIdayplan(Id: number, dayId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const dayplan = await this.tourpackagePlanRepo.findOne({ where: { dayId } })
    if (!dayplan) {
      throw new HttpException(
        `Inclsuions not found with this id=${dayId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.tourpackagePlanRepo.delete(dayId);
  }


  // startr highlights


  // Add package highlight




  async AddPackageHighlight(
    Id: number,
    packageHighlightDto: CreatePackageHighlightDto[],
  ) {
    const tourpackage = await this.TourpackageRepo.findOneBy({ Id });
    if (!tourpackage) {
      throw new HttpException(
        "TourPackage not found, cann't add cover image",
        HttpStatus.BAD_REQUEST,
      );
    }
    const createHightlight: packagehighlight[]= []
    for(const packagehighlightdto of packageHighlightDto){
      const newHightlight = await this.packageHighlightRepo.create({...packagehighlightdto, tourpackage });
      const saveHightlight = await this.packageHighlightRepo.save(newHightlight)
      createHightlight.push(saveHightlight);
    }
    return createHightlight;

  }


  // find highlight
  async FindHighlight(Id: number, HiId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const Highlight = await this.packageHighlightRepo.findOne({ where: { HiId } })
    if (!Highlight) {
      throw new HttpException(
        `Package highlight not found with this id ${HiId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return Highlight;
  }

  // update inclusions
  async updateHighlight(Id: number, HiId: number, updateHighlightDto: UpdatepackageHighlightDto) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const highlight = await this.packageHighlightRepo.findOne({ where: { HiId } })
    if (!highlight) {
      throw new HttpException(
        `Package highlight found with this id=${HiId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedhighlight = await this.packageHighlightRepo.update({ HiId }, { ...updateHighlightDto })
    return updatedhighlight;
  }


  // Delete exclusions
  async DeleteHighlight(Id: number, HiId: number) {
    const tourpackage = await this.TourpackageRepo.findOne({
      where: {
        Id
      }
    })
    if (!tourpackage) {
      throw new HttpException(
        `TourPackage not found with this id=${Id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const highlight = await this.packageHighlightRepo.findOne({ where: { HiId } })
    if (!highlight) {
      throw new HttpException(
        `Package highlight not found with this id=${HiId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.packageHighlightRepo.delete(HiId);
  }

}

// end of travel package




