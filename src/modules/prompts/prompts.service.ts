import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Prompt } from "./prompt.entity";
import { FindPromptsDto } from "./dto/find-prompts.dto";
import { CreatePromptDto } from "./dto/create-prompt.dto";
import { PaginationResult } from "src/common/pagination/pagination.interface";
import { paginate } from "src/common/pagination/pagination.util";

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    protected repository: Repository<Prompt>
  ) {}

  findAll() {
    return this.repository.find({
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
    const prompt = await this.repository.findOne({ where: { id } });
    if (!prompt) throw new NotFoundException("Prompt not found");
    return prompt;
  }

  async findMany(query: FindPromptsDto): Promise<PaginationResult<Prompt>> {
    return paginate<Prompt>(
      this.repository,
      query,
      "prompt",
      (queryBuilder) => {
        queryBuilder.distinct(true);

        // Поиск по названию и описанию
        if (query.search) {
          queryBuilder.andWhere(
            "(prompt.title ILIKE :search OR prompt.description ILIKE :search)",
            { search: `%${query.search}%` }
          );
        }

        // Сортировка по дате создания: новые сверху
        queryBuilder.orderBy("prompt.createdAt", "DESC");
      }
    );
  }

  async create(data: CreatePromptDto) {
    const prompt = this.repository.create(data);
    return this.repository.save(prompt);
  }

  async update(id: string, data: Partial<Prompt>) {
    const prompt = await this.findOne(id);
    Object.assign(prompt, data);
    return this.repository.save(prompt);
  }

  async remove(id: string) {
    const prompt = await this.findOne(id);
    return this.repository.remove(prompt);
  }
}
