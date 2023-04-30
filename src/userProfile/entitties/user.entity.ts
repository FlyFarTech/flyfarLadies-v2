import { IsEmail } from "@nestjs/class-validator"
import { IsNotEmpty } from "class-validator"
import { Tourpackage } from "src/tourpackage/entities/tourpackage.entity"
import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { Cheque } from "./cheq.entity"
import { Cash } from "./cash.entity"
import { MobileBanking } from "./MobileBanking.enity"
import { BankTransfer } from "./BankTransfer.entity"

@Entity()
export class User{
   @PrimaryColumn({type:"uuid"})
   @Generated("uuid")
   uuid:string    
   @IsNotEmpty()
   @Column()
   Name:string
   @IsNotEmpty()
   @Column()
   Mobile:string
   @IsEmail()
   @IsNotEmpty()
   @Column()
   Email:string
   @IsNotEmpty()
   @Column()
   Password:string
   @Column({nullable:true})
   jwtToken:string
   @Column({nullable:true})
   NameTitle:string
   @Column({default:null})   
   FirstName:string
   @Column({default:null})
   LastName:string
   @IsEmail()
   @Column({default:null})
   DOB:string
   @IsNotEmpty()
   @Column({default:false})
   Gender:string
   @IsNotEmpty()
   @Column({default:null})
   Profession:string
   @IsNotEmpty()
   @Column({default:null})
   Nationality:string
   @IsNotEmpty()
   @Column({default:null})
   NID:string
   @Column({default:null})
   Address:string
   @IsNotEmpty()
   @Column({default:null})
   PassportNumber:string
   @Column({default:null})
   Wallet:number
   @IsNotEmpty()
   @Column({default:null})
   PassportExpireDate:string
   @IsNotEmpty()
   @Column({default:null})
   PassportCopy:string
   @IsNotEmpty()
   @Column({default:null})
   PassportsizephotoUrl: string
   @IsNotEmpty() 
   @Column({default:null})
   FaceBookId:string
   @IsNotEmpty()
   @Column({default:null})
   WhatsApp:string
   @IsNotEmpty()
   @Column({default:null})
   LinkedIn:string
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
   @CreateDateColumn()
   CreatedAt:Date
   @UpdateDateColumn()
   UpdatedAt:Date
}