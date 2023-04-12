import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Cheque{
   @PrimaryGeneratedColumn('uuid')
   id:string
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
}