import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from "@nestjs/common";
import { PromptsService } from "./prompts.service";
import { Prompt } from "./prompt.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("prompts")
@Controller("prompts")
export class PromptsController {
  constructor(private readonly prompts: PromptsService) {}

  @Get()
  findAll() {
    return this.prompts.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.prompts.findOne(id);
  }

  @Post()
  create(@Body() dto: Partial<Prompt>) {
    return this.prompts.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: Partial<Prompt>) {
    return this.prompts.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.prompts.remove(id);
  }
}
