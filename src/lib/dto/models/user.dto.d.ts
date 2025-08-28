import { UserRole } from "@lib/enums/user-role.enum";
export declare class UserDto {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
