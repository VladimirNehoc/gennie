import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { RolesGuard } from "src/modules/users/user-roles.guard";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, RolesGuard],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
