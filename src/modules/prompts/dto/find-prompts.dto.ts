// src/modules/prompts/dto/find-prompts.dto.ts
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class FindPromptsDto {
  @IsOptional() @IsString() title?: string;

  @IsOptional() @IsString() description?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
