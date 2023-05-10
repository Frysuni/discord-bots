import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class deferMessages extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    timestamp: string;

    @Column()
    channelId: string;

    @Column()
    whom: string;
}