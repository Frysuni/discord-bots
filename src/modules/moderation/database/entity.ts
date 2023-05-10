import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity()
export class mutedusers extends BaseEntity {
    @PrimaryColumn()
    memberId: string;

    @Column()
    channelId: string;

    @Column()
    mutedUntil: string;
}
