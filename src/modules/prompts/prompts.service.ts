import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Prompt } from "./prompt.entity";
import { FindPromptsDto } from "./dto/find-prompts.dto";

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private repo: Repository<Prompt>
  ) {}

  findAll() {
    return this.repo.find({
      select: [
        "id",
        "title",
        "description",
        "beforeImageId",
        "afterImageId",
        "type",
      ],
    });
  }

  async findOne(id: string) {
    const prompt = await this.repo.findOne({ where: { id } });
    if (!prompt) throw new NotFoundException("Prompt not found");
    return prompt;
  }

  async findMany(dto: FindPromptsDto) {
    const { page = 1, limit = 20, title, description } = dto;

    const qb = this.repo
      .createQueryBuilder("p")
      .orderBy("p.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (title) qb.andWhere("p.title ILIKE :title", { title: `%${title}%` });
    if (description)
      qb.andWhere("p.description ILIKE :desc", { desc: `%${description}%` });

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, limit };
  }

  async create(data: Partial<Prompt>) {
    const prompt = this.repo.create(data);
    return this.repo.save(prompt);
  }

  async update(id: string, data: Partial<Prompt>) {
    const prompt = await this.findOne(id);
    Object.assign(prompt, data);
    return this.repo.save(prompt);
  }

  async remove(id: string) {
    const prompt = await this.findOne(id);
    return this.repo.remove(prompt);
  }
}
