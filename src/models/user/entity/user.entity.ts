import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer'

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn()
    public id: number

    @Column({ unique: true })
    public email: string

    @Exclude()
    @Column()
    public password: string

    @Exclude()
    @Column({ nullable: true })
    public refreshToken: string

    @Column({ default: false })
    public isEmailConfirmed: boolean

    @Exclude()
    @Column({ nullable: true })
    public twoFactorAuthSecret?: string

    @Column({ default: false })
    public isTwoFactorAuthEnabled: boolean

    @Column({ default: false })
    public isRegisteredWithGoogle: boolean;

    @Exclude()
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    public createdAt: Date

    @Exclude()
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    public updatedAt: Date
}
