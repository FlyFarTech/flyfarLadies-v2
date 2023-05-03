import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"


export enum PaymentStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }


 let userCount =0
@Entity()
export class BankTransfer{
   @PrimaryGeneratedColumn('uuid')
   Depositid:string
   @BeforeInsert()
   generateUserId() {
      userCount++;
      this.Depositid = `BANK${100 + userCount}`;
   }
   @Column()
   uuid:string
   @Column({nullable:true})
   DepositFrom:string
   @Column({nullable:true})
   DepositTo:string
   @Column()
   ChequeNumber:string
   @Column({type:'date'})
   ChequeDate:string
   @CreateDateColumn()
   CreatedAt:Date
   @Column({nullable:true})
   TransactionId:string
   @Column({nullable:true})
   DepositType:string
   @Column({nullable:true})
   Amount:number
   @Column({nullable:true})
   Bankattachmenturl:string
   @Column()
   ActionBy:string
   @Column()
   rejectionReason:string
   @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
   status: PaymentStatus;
   @ManyToOne(()=>User, (userprofile)=>userprofile.bankDeposit)
   @JoinColumn({name:'deposit_Id',})
   userprofile:User
}