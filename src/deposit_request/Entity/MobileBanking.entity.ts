import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"


@Entity()
export class MobileBanking{
   @PrimaryGeneratedColumn('uuid')
   id:string
   @Column({nullable:true})
   AgentType:string
   @Column({nullable:true})
   AccountNumber:string
   @Column({nullable:true})
   TransactionId:string
   @Column({nullable:true})
   Reference:string
   @Column('double')
   Amount:number
   @Column('double')
   GatewayFee:number
   @Column('double')
   DepositedAmount:number
   @Column()
   MobBankattachmenturl:string
}