import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { ISchema } from "./base.interface";
import { Expose, Type } from "class-transformer";

export class BaseDto implements ISchema {
  @Expose()
  @IsUUID()
  @Type(() => String)
  @ApiProperty({ format: "uuid" })
  id: string;

  @Expose()
  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: String, format: "date-time" })
  updatedAt: Date;
}
