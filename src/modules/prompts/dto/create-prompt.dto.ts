import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { PromptType } from "@lib/enums/prompt-type.enum";

export class CreatePromptDto {
  @ApiProperty({ example: "Аниме-портрет" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: "Мягкое освещение, крупный план" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: "/uploads/previews/anime-portrait.jpg" })
  @IsOptional()
  @IsString()
  beforeUrl?: string;

  @ApiPropertyOptional({ example: "/uploads/previews/anime-portrait.jpg" })
  @IsOptional()
  @IsString()
  afterUrl?: string;

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
  @IsObject()
  text: Record<string, any> = {};
}
