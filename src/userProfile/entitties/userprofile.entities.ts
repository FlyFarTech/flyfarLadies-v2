
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Cheque } from './cheq.entity';
import { Cash } from './cash.entity';
import { MobileBanking } from './MobileBanking.enity';
import { BankTransfer } from './BankTransfer.entity';

@Entity()
export class Userprofile {
   @PrimaryGeneratedColumn('uuid')
   @IsString()
   uuid:string
   @Column({nullable:true})
   NameTitle:string
   @Column()   
   FirstName:string
   @Column()
   LastName:string
   @IsEmail()
   @Column({default:null})
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
   @OneToMany(() => Tourpackage, tourpackage => tourpackage.usersWishlist, {lazy:true})
   wishlist: Tourpackage[];
   @OneToMany(() => Cheque, (cheque) => cheque.userprofile,{lazy:true})
   chequeDeposit:Promise<Cheque[]>
   @OneToMany(() => Cash, (cash) => cash.userprofile,{lazy:true})
   cashDeposit:Promise<Cash[]>
   @OneToMany(() => MobileBanking, (mobilebank) => mobilebank.userprofile,{lazy:true})
   mobilebankDeposit:Promise<MobileBanking[]> 
   @OneToMany(() => BankTransfer, (banktransfer) => banktransfer.userprofile,{lazy:true})
   bankDeposit:Promise<BankTransfer[]> 
}
