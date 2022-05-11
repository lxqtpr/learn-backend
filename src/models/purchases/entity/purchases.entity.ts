import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from '../../user/entity/user.entity'

@Entity('purchases')
export default class Purchase {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public title: string

    @Column()
    public price: string

    @ManyToOne(
        () => User,
        user => user.purchases,
        { cascade: true, nullable: false }
    )
    public buyer: User

    @Column()
    public imageUrl: string
}
