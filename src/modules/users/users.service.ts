import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRole } from "@lib/enums/user-role.enum";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>
  ) {}

  async create(dto: CreateUserDto, actorRole?: UserRole) {
    // запрещаем не-админам выставлять роль отличную от user
    const role =
      actorRole === UserRole.Admin ? dto.role ?? UserRole.User : UserRole.User;

    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException("Email already in use");

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      email: dto.email,
      passwordHash,
      role,
      isActive: dto.isActive ?? true,
    });
    const saved = await this.repo.save(user);
    return this.stripPassword(saved);
  }

  async findAll() {
    const users = await this.repo.find({ order: { createdAt: "DESC" } });
    return users.map(this.stripPassword);
  }

  async findById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    return this.stripPassword(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    actor: { id: string; role: UserRole }
  ) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    // Только админ может менять роль / isActive и чужие аккаунты
    const isSelf = actor.id === id;
    const isAdmin = actor.role === UserRole.Admin;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException("You can update only your own profile");
    }

    if (dto.role !== undefined && !isAdmin) {
      throw new ForbiddenException("Only admin can change role");
    }
    if (dto.isActive !== undefined && !isAdmin) {
      throw new ForbiddenException("Only admin can change isActive");
    }

    if (dto.email) user.email = dto.email;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);
    if (isAdmin && dto.role !== undefined) user.role = dto.role!;
    if (isAdmin && dto.isActive !== undefined) user.isActive = dto.isActive!;

    const saved = await this.repo.save(user);
    return this.stripPassword(saved);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    await this.repo.remove(user);
    return { id, removed: true };
  }

  private stripPassword = (u: User) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = u;
    return rest;
  };
}
