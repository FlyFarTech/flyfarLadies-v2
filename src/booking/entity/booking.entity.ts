import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, Column } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum BookingStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }


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
   @Column()
   TotalPrice:number
   @Column()
   rejectionReason:string
   @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
   status: BookingStatus;

}