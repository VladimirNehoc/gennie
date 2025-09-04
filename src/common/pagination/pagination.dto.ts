import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";
import { IPaginationQuery } from "./pagination.interface";

export class PaginationQueryDto implements IPaginationQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
