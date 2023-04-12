
import { IsNotEmpty } from '@nestjs/class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { Tourpackage } from './tourpackage.entity';


@Entity()
export class packageexcluions {
  @PrimaryGeneratedColumn()
  ExId: number
  @IsNotEmpty()
  @Column()
  PackageExclusions: string;
  @ManyToOne(() => Tourpackage, (tourpackages) => tourpackages.exclusions)
  @JoinColumn({ name: 'exclsuionId' })
  tourpackage: Tourpackage

}
