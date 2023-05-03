import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Tourpackage } from 'src/tourpackage/entities/tourpackage.entity';


@Entity()
export class WishlistItem {
   @PrimaryGeneratedColumn()
   id:string
   
   @ManyToOne(() => User, user => user.wishlist, { lazy: true })
   user: Promise<User>;
   @ManyToOne(() => Tourpackage, tourPackage => tourPackage.wishlist, { lazy: true })
   tourPackage: Promise<Tourpackage>;
}
