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
   Description:string
   @Column({default:null})
   Name:string
   @CreateDateColumn()
   @Column()
   Date:Date

}
