import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Booking{
   @PrimaryGeneratedColumn('uuid')
   Bookingid:string
   @ManyToOne(() => Tourpackage, tourPackage => tourPackage.bookings)
   tourPackage: Tourpackage;
   @ManyToMany(() => Traveller,)
   @JoinTable({name: 'Traveler_bookings'})
   travelers: Traveller[];
   @CreateDateColumn()
   CreatedAt:Date
   @UpdateDateColumn()
   UpdatedAt:Date


}