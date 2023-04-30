
import { Traveller } from 'src/Traveller/entities/traveller.entity';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, Column, BeforeInsert, getRepository, Repository, getConnection } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum BookingStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }

let userCount = 0;

@Entity()
export class Booking{
   @PrimaryGeneratedColumn('uuid')
   uuid:string
   @Column()
   Bookingid:string
   @CreateDateColumn()
   CreatedAt:Date
   @UpdateDateColumn()
   UpdatedAt:Date
   @Column()
   Email:string
   @Column()
   Name:string
   @Column()
   TotalPrice:number
   @Column({default:null, nullable:true})
   Wallet:number
   @Column({default:null})
   FaceBookId:string
   @Column({default:null})
   WhatsApp:string
   @Column({default:null})
   LinkedIn:string
   @Column({default:null})
   Mobile:string
   @Column()
   rejectionReason:string
   @BeforeInsert()
   generateUserId() {
      userCount++;
      this.Bookingid = `FFLB${100 + userCount}`;
   }
   @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
   status: BookingStatus;
   @ManyToOne(() => Tourpackage, tourPackage => tourPackage.bookings)
   tourPackage: Tourpackage;
   @ManyToMany(() => Traveller,)
   @JoinTable({name: 'Traveler_bookings'})
   travelers: Traveller[];
}