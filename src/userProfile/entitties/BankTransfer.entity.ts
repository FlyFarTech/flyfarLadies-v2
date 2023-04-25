import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Userprofile } from "./userprofile.entities"


@Entity()
export class BankTransfer{
   @PrimaryGeneratedColumn('uuid')
   id:string
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
   @ManyToOne(()=>Userprofile, (userprofile)=>userprofile.bankDeposit)
   @JoinColumn({name:'deposit_Id',})
   userprofile:Userprofile
}