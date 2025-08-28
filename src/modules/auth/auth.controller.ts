import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

const cookieName = "refresh_token";

function setRefreshCookie(res: Response, token: string) {
  const isSecure = String(process.env.COOKIE_SECURE || "false") === "true";
  const domain = process.env.COOKIE_DOMAIN || "localhost";
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    domain,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30d (пример)
  });
}

function clearRefreshCookie(res: Response) {
  const isSecure = String(process.env.COOKIE_SECURE || "false") === "true";
  const domain = process.env.COOKIE_DOMAIN || "localhost";
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    domain,
    path: "/",
  });
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  @ApiCreatedResponse({ description: "User created" })
  async register(@Body() dto: RegisterDto) {
    const user = await this.auth.register(dto.email, dto.password);
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  @Post("login")
  @HttpCode(200)
  @ApiOkResponse({ description: "Logged in" })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, accessToken, refreshToken } = await this.auth.login(
      dto.email,
      dto.password,
      req.get("user-agent") || undefined,
      (req.headers["x-forwarded-for"] as string) || req.ip
    );
    setRefreshCookie(res, refreshToken);
    return { user, accessToken };
  }

  @Post("refresh")
  @HttpCode(200)
  @ApiOkResponse({ description: "Tokens refreshed" })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = dto.refreshToken || req.cookies?.[cookieName];
    const { accessToken, refreshToken } = await this.auth.refresh(
      token,
      req.get("user-agent") || undefined,
      (req.headers["x-forwarded-for"] as string) || req.ip
    );
    setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  @Post("logout")
  @HttpCode(200)
  @ApiOkResponse({ description: "Logged out" })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[cookieName];
    await this.auth.logout(token);
    clearRefreshCookie(res);
    return { ok: true };
  }

  @Get("me")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: "Current user" })
  async me(@Req() req: any) {
    return { id: req.user.userId, role: req.user.role };
  }
}
