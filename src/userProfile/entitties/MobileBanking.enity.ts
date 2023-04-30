import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"



export enum PaymentStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }

@Entity()
export class MobileBanking{
   @PrimaryGeneratedColumn('uuid')
   mobbankid:string
   @Column({nullable:true})
   AgentType:string
   @Column({nullable:true})
   AccountNumber:string
   @Column({nullable:true})
   TransactionId:string
   @Column({nullable:true})
   Reference:string
   @Column('double')
   Amount:number
   @Column('double')
   GatewayFee:number
   @Column('double')
   DepositedAmount:number
   @Column()
   MobBankattachmenturl:string

   @Column()
   rejectionReason:string
   @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
   status: PaymentStatus;
   @ManyToOne(()=>User, (userprofile)=>userprofile.mobilebankDeposit)
   @JoinColumn({name:'bank_Id',})
   userprofile:User
}