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

  // Если хочешь строго проверять URL, замени на IsUrl({ require_tld: false })
  @ApiPropertyOptional({ example: "/uploads/previews/anime-portrait.jpg" })
  @IsOptional()
  @IsString()
  previewUrl?: string;

  @ApiProperty({
    enum: PromptType,
    default: PromptType.ImageToImage,
  })
  @IsEnum(PromptType)
  type: PromptType = PromptType.ImageToImage;

  @ApiProperty({
    type: "object",
    description: "Произвольная конфигурация шаблона",
    example: {
      hiddenPrompt: "anime style, soft light",
      width: 768,
      height: 1024,
    },
  })
  @IsObject()
  config: Record<string, any> = {};

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean = false;
}
