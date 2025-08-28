import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class RefreshDto {
  @ApiPropertyOptional({ description: "Если не cookie, то из body" })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
