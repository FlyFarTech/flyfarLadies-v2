import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PressCoverages{
   @PrimaryGeneratedColumn('uuid')
   uuid:string
   @Column()
   Image:string
   @Column()
   links:string

}