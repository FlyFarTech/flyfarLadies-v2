import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Blog {
   @PrimaryGeneratedColumn('uuid')
   blogid:string
   @Column({default:null})
   coverimage:string
   @Column({default:null})
   Title:string
   @Column({default:null, type:'longtext'})
   Blogfor:string
   @Column({default:null, type:'longtext'})
   WrittenBy:string
   @Column({default:null, type:'longtext'})
   Description:string
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
   @CreateDateColumn()
   Date:Date

}
