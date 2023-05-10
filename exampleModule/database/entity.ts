// https://typeorm.io/#create-an-entity
// Не обращайте внимания на ошибки. Модуль находится не в src.

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity()
export class myDatabaseTable extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;
}

@Entity()
export class myOtherDatabaseTable extends BaseEntity {
    @PrimaryColumn()
    number: number;

    @Column()
    text: string;
}