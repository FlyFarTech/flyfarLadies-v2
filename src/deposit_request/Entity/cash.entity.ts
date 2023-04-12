import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



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

}