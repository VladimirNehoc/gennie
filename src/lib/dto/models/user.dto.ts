import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@lib/enums/user-role.enum";

export class UserDto {
  @ApiProperty({ type: String, format: "uuid" })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt!: string;
}
