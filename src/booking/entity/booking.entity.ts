import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, Column, BeforeInsert, getRepository } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum BookingStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }




// export class CustomUuidGenerator implements ValueGenerator<string> {
//   private static lastNumber = 0;
//   private prefix: string;

//   constructor(prefix: string) {
//     this.prefix = prefix;
//   }

//   public async generate(): Promise<string> {
//     CustomUuidGenerator.lastNumber += 1;
//     return `${this.prefix}${CustomUuidGenerator.lastNumber.toString().padStart(4, '0')}`;
//   }
// }


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