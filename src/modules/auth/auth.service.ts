import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan, IsNull } from "typeorm";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { Session } from "./session.entity";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";

type TokenPair = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
    @InjectRepository(Session) private readonly sessions: Repository<Session>
  ) {}

  private accessTtl() {
    return process.env.JWT_ACCESS_TTL || "15m";
  }
  private refreshTtlMs() {
    // parse like 7d, 30d, 3600000ms, fallback 7d
    const raw = process.env.JWT_REFRESH_TTL || "7d";
    const m = raw.match(/^(\d+)([smhd])$/); // s/m/h/d
    if (!m) return 7 * 24 * 3600 * 1000;
    const n = +m[1];
    const u = m[2];
    const mult =
      u === "s" ? 1000 : u === "m" ? 60000 : u === "h" ? 3600000 : 86400000;
    return n * mult;
  }

  async register(email: string, password: string) {
    // UsersService уже валидирует уникальность/хэширует
    return this.users.create({ email, password });
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    return user;
  }

  private async signTokens(user: User, jti: string): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: this.accessTtl() }
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, jti, typ: "refresh" },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_TTL || "7d",
      }
    );
    return { accessToken, refreshToken };
  }

  async createSessionAndTokens(user: User, userAgent?: string, ip?: string) {
    const jti = uuidv4();
    const { accessToken, refreshToken } = await this.signTokens(user, jti);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + this.refreshTtlMs());

    const session = this.sessions.create({
      user,
      jti,
      refreshTokenHash,
      userAgent,
      ip,
      expiresAt,
    });
    await this.sessions.save(session);

    return { accessToken, refreshToken, session };
  }

  async login(
    email: string,
    password: string,
    userAgent?: string,
    ip?: string
  ) {
    const user = await this.validateUser(email, password);
    const { accessToken, refreshToken } = await this.createSessionAndTokens(
      user,
      userAgent,
      ip
    );
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken, // можно не возвращать, если используешь только cookie
    };
  }

  async refresh(
    fromCookieOrBody: string | undefined,
    userAgent?: string,
    ip?: string
  ) {
    const token = fromCookieOrBody;
    if (!token) throw new UnauthorizedException("No refresh token");

    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const { sub: userId, jti } = payload as { sub: string; jti: string };
    const session = await this.sessions.findOne({
      where: { jti, revokedAt: IsNull(), expiresAt: MoreThan(new Date()) },
      relations: ["user"],
    });
    if (!session || session.user.id !== userId) {
      throw new UnauthorizedException("Session invalid");
    }

    const match = await bcrypt.compare(token, session.refreshTokenHash);
    if (!match) throw new ForbiddenException("Token mismatch");

    // rotate: revoke old, create new
    session.revokedAt = new Date();
    await this.sessions.save(session);

    const user = session.user;
    const { accessToken, refreshToken } = await this.createSessionAndTokens(
      user,
      userAgent,
      ip
    );
    return { accessToken, refreshToken };
  }

  async logout(tokenFromCookieOrBody?: string) {
    if (!tokenFromCookieOrBody) return { ok: true };
    try {
      const { jti } = await this.jwt.verifyAsync(tokenFromCookieOrBody, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const session = await this.sessions.findOne({
        where: { jti, revokedAt: IsNull() },
      });
      if (session) {
        session.revokedAt = new Date();
        await this.sessions.save(session);
      }
    } catch {
      // ignore
    }
    return { ok: true };
  }
}
