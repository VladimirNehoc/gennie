import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "src/modules/users/dto/user.dto";
import { Roles } from "src/modules/users/user-roles.decorator";
import { RolesGuard } from "src/modules/users/user-roles.guard";
import { UserRole } from "src/modules/users/types/user-role.enum";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // Только админ видит список и создаёт пользователей
  @Get()
  @Roles(UserRole.Admin)
  @ApiOkResponse({ type: [UserDto] })
  findAll() {
    return this.users.findAll();
  }

  @Post()
  @Roles(UserRole.Admin)
  @ApiCreatedResponse({ type: UserDto })
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.users.create(dto, req.user?.role);
  }

  // Профиль текущего пользователя
  @Get("me")
  @ApiOkResponse({ type: UserDto })
  me(@Req() req: any) {
    return this.users.findById(req.user.id);
  }

  // Только админ может читать произвольного пользователя
  @Get(":id")
  @Roles(UserRole.Admin)
  @ApiOkResponse({ type: UserDto })
  findOne(@Param("id") id: string) {
    return this.users.findById(id);
  }

  // Обновление: админ может менять кого угодно; юзер — только себя (и не роль)
  @Patch(":id")
  @ApiOkResponse({ type: UserDto })
  update(@Param("id") id: string, @Body() dto: UpdateUserDto, @Req() req: any) {
    return this.users.update(id, dto, { id: req.user.id, role: req.user.role });
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  @ApiOkResponse({ schema: { example: { id: "uuid", removed: true } } })
  remove(@Param("id") id: string) {
    return this.users.remove(id);
  }
}
