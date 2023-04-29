
import { Booking } from "src/booking/entity/booking.entity";
import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
import { Userprofile } from "src/userProfile/entitties/userprofile.entities";


@Entity()
export class Tourpackage {
    @PrimaryGeneratedColumn()
    Id: number;
    @Column({ nullable: true })
    MainTitle: string;
    @Column({ nullable: true })
    SubTitle: string;
    @Column({ nullable: true })
    Price: number;
    @Column({ nullable: true })
    Location: string;
    @Column({ nullable: true })
    City: string
    @Column({ nullable: true })
    Discount: number
    @Column({default:null,type:'date' })
    StartDate: Date;
    @Column({default:null,type:'date' })
    EndDate: Date;
    @Column({ nullable: true })
    TripType: string;
    @Column({ nullable: true })
    Country: string;
    @Column({ nullable: true })
    TotalDuration: string
    @Column('text', { nullable: true })
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
    @Column({ nullable: true })
    coverimageurl: string

    @OneToMany(() => MainImage, (mainimage) => mainimage.tourpackage,{lazy:true} )
    mainimage:Promise<MainImage[]> ;
    @OneToMany(() => AlbumImage, (albumImage) => albumImage.tourpackage,{lazy:true})
    albumImages: Promise<AlbumImage[]> ;
    
    @OneToMany(() => VisitedPlace, (visitedimage) => visitedimage.tourpackage,{lazy:true} )
    vistitedImages:Promise<VisitedPlace[]>;
    @OneToMany(() => packageexcluions, (exclusion) => exclusion.tourpackage, {lazy:true, eager:true})
    exclusions:Promise<packageexcluions[]>;
    @OneToMany(() => Packageinclusion, (inclsuions) => inclsuions.tourpackage,{lazy:true, eager:true} )
    PackageInclusions:Promise<Packageinclusion[]> ;

    @OneToMany(() => bookingpolicy, (policy) => policy.tourpackage,{lazy:true, eager:true})
    BookingPolicys:Promise<bookingpolicy[]> ;

    @OneToMany(() => packagehighlight, (highlights) => highlights.tourpackage,{lazy:true} )
    highlights:Promise<packagehighlight[]>;

    @OneToMany(() => refundpolicy, (refundpolicy) => refundpolicy.tourpackage,{lazy:true, eager:true})
    refundpolicys:Promise<refundpolicy[]>;

    @OneToMany(() => tourpackageplan, (dayplans) => dayplans.tourpackage,{lazy:true})
    tourpackageplans:Promise<tourpackageplan[]> ;

    @OneToMany(() => Installment, (installment) => installment.tourpackage,{lazy:true} )
    installments:Promise <Installment[]>;

    @OneToMany(() => Booking, (booking) => booking.tourPackage,{lazy:true})
    bookings:Promise<Booking[]>   

    @ManyToOne(() => Userprofile, userprofile => userprofile.wishlist,{lazy:true})
    usersWishlist:Promise<Userprofile[]>;


}
