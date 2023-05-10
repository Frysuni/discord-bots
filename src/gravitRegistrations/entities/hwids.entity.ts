import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Blob } from "node:buffer";
import { UsersEntity } from "./users.entity";

@Entity('hwids')
export class HwidsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'blob' })
  publicKey: Buffer;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  hwDiskId: string;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  baseboardSerialNumber: string;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  graphicCard: string;

  @Column('blob')
  displayId: Buffer;

  @Column({ type: 'int', nullable: true, default: null })
  bitness: number;

  @Column({ type: 'bigint', nullable: true, default: null })
  totalMemory: bigint;

  @Column({ type: 'int', nullable: true, default: null })
  logicalProcessors: number;

  @Column({ type: 'int', nullable: true, default: null })
  physicalProcessors: number;

  @Column({ type: 'bigint', nullable: true, default: null })
  processorMaxFreq: bigint;

  @Column({ type: 'tinyint', nullable: false, default: 0 })
  battery: number;

  @Column({ type: 'tinyint', nullable: false, default: 0 })
  banned: number;

  @OneToOne(() => UsersEntity, user => user.hwid)
  user: UsersEntity;
}