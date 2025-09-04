import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from "@nestjs/swagger";
import { PromptType } from "src/modules/prompts/types/prompt-type.enum";
import { IPrompt, IPromptBase } from "../types/prompt.interface";
import { BaseDto } from "src/common/base/base.dto";

export class PromptBaseDto implements IPromptBase {
  @ApiProperty({ example: "Аниме-портрет" })
  title!: string;

  @ApiPropertyOptional({
    example: "Мягкое освещение, крупный план",
    nullable: true,
  })
  description!: string;

  @ApiPropertyOptional({
    example: "/uploads/previews/anime-portrait.jpg",
    nullable: true,
  })
  beforeImageId!: string;

  @ApiPropertyOptional({
    example: "/uploads/previews/anime-portrait.jpg",
    nullable: true,
  })
  afterImageId!: string;

  @ApiProperty({ enum: PromptType })
  type!: PromptType;

  @ApiProperty({
    type: "string",
    description: "Текст промпта",
  })
  text!: string;
}

export class PromptDto
  extends IntersectionType(PromptBaseDto, BaseDto)
  implements IPrompt {}
