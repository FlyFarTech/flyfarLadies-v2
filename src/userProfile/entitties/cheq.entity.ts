import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


export enum PaymentStatus {
   PENDING = 'pending',
   APPROVED = 'approved',
   REJECTED = 'rejected',
 }


 let userCount=0
@Entity()
export class Cheque{
   @PrimaryGeneratedColumn('uuid')
   cheqdepoid:string
   @BeforeInsert()
   generateUserId() {
      userCount++;
      this.cheqdepoid = `CHQ${100 + userCount}`;
   }
   @Column()
   ChequeNumber:string
   @Column()
   uuid:string
   @Column()
   BankName:string
   @Column({type:'date'})
   ChequeDate:Date
   @Column()
   Reference:string
   @Column()
   DepositType:string
   @Column()
   Amount:number
   @CreateDateColumn()
   CreatedAt:Date
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