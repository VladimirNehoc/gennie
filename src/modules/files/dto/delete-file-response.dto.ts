// dto/delete-file-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class DeleteFileResponseDto {
  @ApiProperty({ example: true })
  ok: boolean;

  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "UUID удалённого файла",
  })
  id: string;
}
