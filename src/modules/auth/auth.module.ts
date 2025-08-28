import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Session } from "./session.entity";
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Session]),
    JwtModule.register({
      // можно registerAsync + ConfigModule, если хочешь
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
  exports: [AuthService],
})
export class AuthModule {}
