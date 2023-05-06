
import { User } from 'src/userProfile/entitties/user.entity';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Traveller {
   @PrimaryGeneratedColumn('uuid')
   TravellerId:string
   @Column({default:null})   
   FirstName:string
   @Column({default:null})   
   Title:string
   @Column({default:null})
   LastName:string
   @Column({default:null})
   DOB:string
   @Column({nullable:true})
   Email: string
   @Column({default:null})
   Gender:string
   @Column({default:null})
   Price:number
   @Column({default:null})
   Nationality:string
   @Column({default:null})
   PassportNumber:string
   @Column({default:null})
   PassportExpireDate:string
   @Column({default:null})
   PaxType:string
   @Column({default:null})
   PassportCopyURL:string
   @ManyToOne(() => User, (user) => user.travelers)
   user:User;
   @CreateDateColumn()
   CreatedAt:Date
   @UpdateDateColumn()
   UpdatedAt:Date
}