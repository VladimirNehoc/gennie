import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PromptType } from "@lib/enums/prompt-type.enum";
import { IPrompt } from "@lib/interfaces/prompt";

export class PromptDto implements IPrompt {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "Аниме-портрет" })
  title!: string;

  @ApiPropertyOptional({
    example: "Мягкое освещение, крупный план",
    nullable: true,
  })
  description?: string | null;

  @ApiPropertyOptional({
    example: "/uploads/previews/anime-portrait.jpg",
    nullable: true,
  })
  previewUrl?: string | null;

  @ApiProperty({ enum: PromptType })
  type!: PromptType;

  @ApiProperty({
    type: "object",
    description: "Конфигурация шаблона",
    example: {
      hiddenPrompt: "anime style, soft light",
      width: 768,
      height: 1024,
    },
  })
  config!: Record<string, any>;

  @ApiProperty({ example: false })
  isPremium!: boolean;

  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2025-08-27T12:34:56.000Z",
  })
  createdAt!: Date;
}
