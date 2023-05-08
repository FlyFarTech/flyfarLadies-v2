import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class socialimageenity{
   @PrimaryGeneratedColumn('uuid')
   uuid:string
   @Column()
   Logo:string
   @Column()
   facebookIcon:string
   @Column()
   linkedinIcon:string
   @Column()
   whatsappIcon:string
}
