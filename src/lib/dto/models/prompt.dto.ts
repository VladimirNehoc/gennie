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
  beforeUrl?: string | null;

  @ApiPropertyOptional({
    example: "/uploads/previews/anime-portrait.jpg",
    nullable: true,
  })
  afterUrl?: string | null;

  @ApiProperty({ enum: PromptType })
  type!: PromptType;

  @ApiProperty({
    type: "string",
    description: "Текст промпта",
  })
  text!: string;

  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2025-08-27T12:34:56.000Z",
  })
  createdAt!: Date;

  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2025-08-27T12:34:56.000Z",
  })
  updatedAt!: Date;
}
