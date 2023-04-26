import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Userprofile } from "./userprofile.entities";


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
   @ManyToOne(()=>Userprofile, (userprofile)=>userprofile.chequeDeposit)
   @JoinColumn({name:'deposit_Id'})
   userprofile:Userprofile
}