import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"



export enum PaymentStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }


 let userCount =0
@Entity()
export class MobileBanking{
   @PrimaryGeneratedColumn('uuid')
   mobbankid:string

   generateUserId() {
      userCount++;
      this.mobbankid = `BANK${100 + userCount}`;
   }
   @Column()
   uuid:string
   @Column({nullable:true})
   AgentType:string
   @Column({nullable:true})
   @CreateDateColumn()
   CreatedAt:Date
   @Column()
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
   @Column({default:null, nullable:true})
   DepositType:string
   @Column()
   rejectionReason:string
   @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
   status: PaymentStatus;
   @ManyToOne(()=>User, (userprofile)=>userprofile.mobilebankDeposit)
   @JoinColumn({name:'bank_Id',})
   userprofile:User
}