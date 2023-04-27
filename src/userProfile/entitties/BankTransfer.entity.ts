import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Userprofile } from "./userprofile.entities"


export enum PaymentStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }

@Entity()
export class BankTransfer{
   @PrimaryGeneratedColumn('uuid')
   bankdepoid:string
   @Column({nullable:true})
   DepositFrom:string
   @Column({nullable:true})
   DepositTo:string
   @Column({type:'date'})
   ChequeDate:string
   @Column({nullable:true})
   TransactionId:string
   @Column({nullable:true})
   Amount:number
   @Column({nullable:true})
   Bankattachmenturl:string
   @Column()
   rejectionReason:string
   @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
   status: PaymentStatus;
   @ManyToOne(()=>Userprofile, (userprofile)=>userprofile.bankDeposit)
   @JoinColumn({name:'deposit_Id',})
   userprofile:Userprofile
}