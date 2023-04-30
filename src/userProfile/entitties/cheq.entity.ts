import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";



export enum PaymentStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }

@Entity()
export class Cheque{
   @PrimaryGeneratedColumn('uuid')
   cheqdepoid:string
   @Column()
   ChequeNumber:string
   @Column()
   BankName:string
   @Column({type:'date'})
   ChequeDate:string
   @Column()
   Reference:string
   @Column()
   Amount:number
   @Column()
   chequeattachmenturl:string
   @Column()
   rejectionReason:string

   @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
   status: PaymentStatus;

   @ManyToOne(()=>User, (userprofile)=>userprofile.chequeDeposit)
   @JoinColumn({name:'deposit_Id'})
   userprofile:User
}