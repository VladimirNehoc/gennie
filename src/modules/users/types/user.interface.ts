import { ISchema } from "src/common/base/base.interface";
import { UserRole } from "./user-role.enum";

export interface IUserBase {
  email: string;
  passwordHash: string;
  role: UserRole;
  credits: number;
  isActive: boolean;
}

export interface IUser extends ISchema, IUserBase {}
