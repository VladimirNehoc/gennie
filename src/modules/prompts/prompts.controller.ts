import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { PromptsService } from "./prompts.service";
import { Prompt } from "./prompt.entity";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "@lib/guards/user-roles.guard";
import { UserRole } from "@lib/enums/user-role.enum";
import { Roles } from "@lib/decorators/user-roles.decorator";

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  create(@Body() dto: Partial<Prompt>) {
    return this.prompts.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  update(@Param("id") id: string, @Body() dto: Partial<Prompt>) {
    return this.prompts.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  remove(@Param("id") id: string) {
    return this.prompts.remove(id);
  }
}
