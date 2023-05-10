import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HwidsEntity } from "./hwids.entity";

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  discordId: string;

  @Column({ type: 'char', length: 32, default: null })
  accessToken: string;

  @Column({ type: 'varchar', length: 41, default: null })
  serverID: string;

  @Column({ type: 'bigint', default: null })
  hwidId: bigint;

  @OneToOne(() => HwidsEntity, hwid => hwid.user)
  hwid: HwidsEntity;
}