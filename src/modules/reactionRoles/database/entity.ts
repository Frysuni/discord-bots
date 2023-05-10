import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class reactRole extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleId: string;

    @Column()
    messageId: string;

    @Column()
    channelId: string;

    @Column()
    emoji: string;
}