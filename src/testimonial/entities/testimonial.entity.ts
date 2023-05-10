import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Testimonial {
   @PrimaryGeneratedColumn('uuid')
   testid:string
   @Column()
   ClientName:string
   @Column()
   ClientDesignation:string
   @Column()
   CompanyName:string
   @Column()
   ClientImage:string
   @Column({default:null})
   Image1:string
   @Column({default:null})
   Image2:string
   @Column({default:null})
   Image3:string
   @Column({default:null})
   Image4:string
   @Column({default:null})
   Image5:string
   @Column({default:null, type:'longtext'})
   Description:string
   @CreateDateColumn()
   Date:Date

}
