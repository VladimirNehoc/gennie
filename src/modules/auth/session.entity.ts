import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
  user: User;

  @Index({ unique: true })
  @Column()
  jti: string; // id refresh-токена

  @Column()
  refreshTokenHash: string;

  @Column({ type: "timestamptz" })
  expiresAt: Date;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ip?: string;

  @Column({ type: "timestamptz", nullable: true })
  revokedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
