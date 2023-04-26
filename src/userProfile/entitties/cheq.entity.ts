import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Userprofile } from "./userprofile.entities";


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

   @ManyToOne(()=>Userprofile, (userprofile)=>userprofile.chequeDeposit)
   @JoinColumn({name:'deposit_Id'})
   userprofile:Userprofile
}