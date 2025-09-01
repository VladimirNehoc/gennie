import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { UserRole } from "@lib/enums/user-role.enum";
import { ConfigService } from "@nestjs/config";

export interface AccessPayload {
  sub: string;
  role: UserRole;
  credits: number;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_ACCESS_SECRET") as string,
    });
  }
  validate(payload: AccessPayload) {
    return {
      userId: payload.sub,
      role: payload.role,
      credits: payload.credits,
      email: payload.email,
    };
  }
}
