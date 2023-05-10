import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity()
export class ranksystem extends BaseEntity {
    @PrimaryColumn()
    memberId: string;

    @Column()
    level: number;

    @Column()
    exp: number;
}
