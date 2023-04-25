import { IsEmail, IsNotEmpty } from 'class-validator';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { Column, CreateDateColumn, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Userprofile {
   @PrimaryColumn({type:"uuid"})
   @Generated("uuid")
   Uid:string
   @Column({nullable:true})
   NameTitle:string
   @Column()   
   FirstName:string
   @Column()
   LastName:string
   @IsEmail()
   @Column()
   Email:string
   @Column()
   DOB:string
   @IsNotEmpty()
   @Column({default:false})
   Gender:string
   @IsNotEmpty()
   @Column()
   Profession:string
   @IsNotEmpty()
   @Column()
   Nationality:string
   @IsNotEmpty()
   @Column()
   NID:string
   @Column()
   Address:string
   @IsNotEmpty()
   @Column()
   Mobile:string
   @IsNotEmpty()
   @Column()
   PassportNumber:string
   @IsNotEmpty()
   @Column()
   PassportExpireDate:string
   @IsNotEmpty()
   @Column()
   PassportCopy:string
   @IsNotEmpty()
   @Column()
   PassportsizephotoUrl: string
   @IsNotEmpty() 
   @Column()
   FaceBookId:string
   @IsNotEmpty()
   @Column()
   WhatsApp:string
   @IsNotEmpty()
   @Column()
   LinkedIn:string
   @CreateDateColumn()
   CreatedAt:Date
   @UpdateDateColumn()
   UpdatedAt:Date
   @OneToMany(() => Tourpackage, tourpackage => tourpackage.usersWishlist, {eager:true})
   wishlist: Tourpackage[];
}
