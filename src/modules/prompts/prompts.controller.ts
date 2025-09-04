import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from "@nestjs/common";
import { PromptsService } from "./prompts.service";
import { Prompt } from "./prompt.entity";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/users/user-roles.guard";
import { UserRole } from "src/modules/users/types/user-role.enum";
import { Roles } from "src/modules/users/user-roles.decorator";
import { CreatePromptDto } from "./dto/create-prompt.dto";
import { FindPromptsDto } from "./dto/find-prompts.dto";
import { PaginationResult } from "src/common/pagination/pagination.interface";
import { IPrompt } from "./types/prompt.interface";

@ApiTags("prompts")
@Controller("prompts")
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  findMany(@Query() query: FindPromptsDto): Promise<PaginationResult<IPrompt>> {
    return this.promptsService.findMany(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<IPrompt> {
    return this.promptsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  create(@Body() dto: CreatePromptDto): Promise<IPrompt> {
    return this.promptsService.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  update(
    @Param("id") id: string,
    @Body() dto: Partial<Prompt>
  ): Promise<IPrompt> {
    return this.promptsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async remove(@Param("id") id: string): Promise<void> {
    await this.promptsService.remove(id);
  }
}
