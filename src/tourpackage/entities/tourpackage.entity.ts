
import { Booking } from "src/booking/entity/booking.entity";
import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AlbumImage } from "./albumimage.entity";
import { bookingpolicy } from "./bookingpolicy.entity";
import { Installment } from "./installment.entity";
import { MainImage } from "./mainimage.entity";
import { packageexcluions } from "./packageexclsuions.entity";
import { packagehighlight } from "./packagehighlight.entity";
import { Packageinclusion } from "./packageInclusion.entitry";
import { refundpolicy } from "./refundpolicy.entity";
import { tourpackageplan } from "./tourpackageplan.entity";
import { VisitedPlace } from "./visitedplace.entity";
import { IsNotEmpty } from "class-validator";
import { WishlistItem } from "src/userProfile/entitties/wishlist.entity";
import { type } from "os";

let userCount = Math.floor(Math.random() * 10000);

@Entity()
export class Tourpackage {
    // @PrimaryGeneratedColumn('uuid')
    // uuid: string;
    @PrimaryColumn()
    Id:string
    @BeforeInsert()
    generateUserId() {
       userCount++;
       this.Id = `FFLPKID${100 + userCount}`;
    }
    @IsNotEmpty({message:'Main title could not be empty'})
    @Column({ nullable: true })
    MainTitle: string;
    @IsNotEmpty({message:'SubTitle could not be empty'})
    @Column({ nullable: true })
    SubTitle: string;
    @IsNotEmpty({message:'Price could not be empty'})
    @Column({ nullable: true })
    Price: number;
    @IsNotEmpty({message:'Location could not be empty'})
    @Column({ nullable: true })
    Location: string;
    @IsNotEmpty({message:'City could not be empty'})
    @Column({ nullable: true })
    City: string
    @IsNotEmpty({message:'Discount could not be empty'})
    @Column({ nullable: true })
    Discount: number
    @IsNotEmpty({message:'StartDate could not be empty'})
    @Column({default:null,type:'date' })
    StartDate: Date;
    @IsNotEmpty({message:'EndDate could not be empty'})
    @Column({default:null,type:'date' })
    EndDate: Date;
    @IsNotEmpty({message:'TripType could not be empty'})
    @Column({ nullable: true })
    TripType: string;
    @IsNotEmpty({message:'Country could not be empty'})
    @Column({ nullable: true })
    Country: string;
    @IsNotEmpty({message:'TotalDuration could not be empty'})
    @Column({ nullable: true })
    TotalDuration: string
    @IsNotEmpty({message:'PackageOverview could not be empty'})
    @Column({ nullable: true,length: 1000, type:'text' })
    PackageOverview: string;
    @Column('bool', { default: false, nullable: true })
    Availability: boolean
    @Column('bool', { default: false, nullable: true })
    Showpackage: boolean
    @Column('bool', { default: false, nullable: true })
    Flight: boolean
    @Column('bool', { default: false, nullable: true })
    Food: boolean
    @Column('bool', { default: false, nullable: true })
    Transport: boolean
    @Column('bool', { default: false, nullable: true })
    Hotel: boolean
    @IsNotEmpty({message:'coverimageurl could not be empty'})
    @Column({ nullable: true })
    coverimageurl: string

    @OneToMany(() => MainImage, (mainimage) => mainimage.tourpackage,{lazy:true} )
    mainimage:Promise<MainImage[]> ;
    @OneToMany(() => AlbumImage, (albumImage) => albumImage.tourpackage,{lazy:true})
    albumImages: Promise<AlbumImage[]> ;
    @OneToMany(() => VisitedPlace, (visitedimage) => visitedimage.tourpackage,{lazy:true} )
    vistitedImages:Promise<VisitedPlace[]>;
    @OneToMany(() => packageexcluions, (exclusion) => exclusion.tourpackage, {lazy:true})
    exclusions:Promise<packageexcluions[]>;
    @OneToMany(() => Packageinclusion, (inclsuions) => inclsuions.tourpackage,{lazy:true} )
    PackageInclusions:Promise<Packageinclusion[]> ;
    @OneToMany(() => bookingpolicy, (policy) => policy.tourpackage,{lazy:true, eager:true})
    BookingPolicys:Promise<bookingpolicy[]> ;
    @OneToMany(() => packagehighlight, (highlights) => highlights.tourpackage,{lazy:true} )
    highlights:Promise<packagehighlight[]>;
    @OneToMany(() => refundpolicy, (refundpolicy) => refundpolicy.tourpackage,{lazy:true})
    refundpolicys:Promise<refundpolicy[]>;
    @OneToMany(() => tourpackageplan, (dayplans) => dayplans.tourpackage,{lazy:true})
    tourpackageplans:Promise<tourpackageplan[]> ;
    @OneToMany(() => Installment, (installment) => installment.tourpackage,{lazy:true} )
    installments:Promise <Installment[]>;
    @OneToMany(() => Booking, (booking) => booking.tourPackage,{lazy:true})
    bookings:Promise<Booking[]>;  
    @OneToMany(() => WishlistItem, wishlistItem => wishlistItem.tourPackage)
    wishlist: WishlistItem[];


}
