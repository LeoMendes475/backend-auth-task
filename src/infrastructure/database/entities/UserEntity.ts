import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string;

  @Column()
  isOnboarded: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date | null;

  @CreateDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  constructor(props?: Partial<UserEntity>) {
    this.id = props?.id ?? uuid();
    this.name = props?.name ?? "";
    this.email = props?.email ?? "";
    this.role = props?.role ?? "user";
    this.isOnboarded = props?.isOnboarded ?? false;
    this.createdAt = props?.createdAt ?? new Date();
    this.updatedAt = props?.updatedAt ?? null;
    this.deletedAt = props?.deletedAt ?? null;
  }
}
