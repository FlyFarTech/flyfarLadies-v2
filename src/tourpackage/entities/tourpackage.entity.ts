
import { Booking } from "src/booking/entity/booking.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
    @Column({ nullable: true })
    StartDate: string;
    @Column({ nullable: true })
    EndDate: string;
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

    @OneToMany(() => MainImage, (mainimage) => mainimage.tourpackage, {
        eager: true,cascade: false
    })
    mainimage: MainImage;

    @OneToMany(() => AlbumImage, (albumImage) => albumImage.tourpackage, {
        eager: true,cascade: false
    })
    albumImages: AlbumImage;

    @OneToMany(() => VisitedPlace, (visitedimage) => visitedimage.tourpackage, {
        eager: true,cascade: false
    })
    vistitedImages: VisitedPlace;
    @OneToMany(() => packageexcluions, (exclusion) => exclusion.tourpackage, {
        eager: true,cascade: false
    })
    exclusions: packageexcluions;
    @OneToMany(() => Packageinclusion, (inclsuions) => inclsuions.tourpackage, {
        eager: true,cascade: false
    })
    PackageInclusions: Packageinclusion;

    @OneToMany(() => bookingpolicy, (policy) => policy.tourpackage, {
        eager: true, cascade: false
    })
    BookingPolicys: bookingpolicy;

    @OneToMany(() => packagehighlight, (highlights) => highlights.tourpackage, {
        eager: true,cascade: false
    })
    highlights: packagehighlight;

    @OneToMany(() => refundpolicy, (refundpolicy) => refundpolicy.tourpackage, {
        eager: true,cascade: false
    })
    refundpolicys: refundpolicy;

    @OneToMany(() => tourpackageplan, (dayplans) => dayplans.tourpackage, {
        eager: true,cascade: false
    })
    tourpackageplans: tourpackageplan;

    @OneToMany(() => Installment, (installment) => installment.tourpackage, {
        eager: true, cascade: false,
    })
    installments: Installment;

    @OneToMany(() => Booking, (booking) => booking.tourPackage)
    bookings: Booking[]

    @ManyToOne(() => Userprofile, userprofile => userprofile.wishlist)
    usersWishlist: Userprofile[];


}
