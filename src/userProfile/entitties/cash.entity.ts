import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Userprofile } from "./userprofile.entities";



@Entity()
export class Cash{
   @PrimaryGeneratedColumn('uuid')
   id:string
   @Column()
   Name:string
   @Column()
   ReceiverName:string
   @Column()
   Reference:string
   @Column()
   Amount:number
   @Column()
   cashattachmenturl:string
   @ManyToOne(()=>Userprofile, (userprofile)=>userprofile.cashDeposit)
   @JoinColumn({name:'cash_Id'})
   userprofile:Userprofile

}