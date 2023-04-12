
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tourpackage } from './tourpackage.entity';

@Entity()
export class AlbumImage{
   @PrimaryGeneratedColumn()
   AlbumId: number;
   @Column({default:true})
   AlbumTitle: string;
   @Column({default:true})
   albumImageUrl: string;
   @ManyToOne(() => Tourpackage, tourpackage=>tourpackage.albumImages)
   tourpackage:Tourpackage;
   
}
