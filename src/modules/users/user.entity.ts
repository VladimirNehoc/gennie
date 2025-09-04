import { Entity, Column, Index } from "typeorm";
import { UserRole } from "src/modules/users/types/user-role.enum";
import { BaseEntity } from "src/common/base/base.entity";
import { IUser } from "./types/user.interface";

@Entity("users")
export class User extends BaseEntity implements IUser {
  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column({ default: 0 })
  credits: number;

  @Column({ default: true })
  isActive: boolean;
}
