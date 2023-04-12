import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"


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
}