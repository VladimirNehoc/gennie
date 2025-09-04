import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PromptType } from "src/modules/prompts/types/prompt-type.enum";
import { IPromptCreate } from "../types/prompt-mutations.interface";

export class CreatePromptDto implements IPromptCreate {
  @ApiProperty({ example: "Аниме-портрет" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: "Мягкое освещение, крупный план" })
  @IsOptional()
  @IsString()
  description!: string;

  @ApiPropertyOptional({ example: "/uploads/previews/anime-portrait.jpg" })
  @IsOptional()
  @IsString()
  beforeImageId!: string;

  @ApiPropertyOptional({ example: "/uploads/previews/anime-portrait.jpg" })
  @IsOptional()
  @IsString()
  afterImageId!: string;

  @ApiProperty({
    enum: PromptType,
    default: PromptType.ImageToImage,
  })
  @IsEnum(PromptType)
  type: PromptType = PromptType.ImageToImage;

  @ApiProperty({
    type: "text",
    description: "промпт шаблона",
  })
  @IsString()
  text: string;
}
